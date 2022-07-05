---
layout: post
title:  "Looping over complex objects in Azure Pipelines"
date: '2022-07-03 15:45:00 +0100'
tags: devops azure-pipelines loops
image: pipelines.png
---

## The benefit of loops in Azure Pipelines
A common situation I run into when creating pipelines is that *similar steps should take place for different enviroments*. In software development we are all great fans of the DRY principle. What we sometimes forget is that it can be applied to IaC and pipeline configuration too. In Azure pipelines we can easily prevent repeating ourselves by looping over `object` parameters!

## Code examples
We can loop over numbers, or usernames quite easily in Azure pipelines.
```yml
parameters:
  - name: users
    type: object
    default:
      - alice
      - bob

steps:
  - ${{ each user in parameters.users }} {% endraw %}:
    - script: add-user.sh {% raw %} ${{ user }} {% endraw %}
```
What many people however do not know, is that we can also loop over more complicated objects such as users containing *an email address, age, et cetera*.

We will see two examples where loops are particularly fruitful in pipelines:
1. Validating that infra deployments are syntactically correct for all to-be-deployed-to envs. 
1. In CI/CD pipelines we often want to deploy to an Azure Web App or Kubernetes cluster for different environments.

## Looping over steps - Validating an infra deployment
When using ARM or bicep templates, it is a good practice to validate if the template + corresponding parameter files are syntactically correct. We do using the `az group deployment validate --template-file <template.yml> -- parameters <parameters.{d,t,p}>` command. I like to validate if it's valid for all environments beforing continuing to any of the deployments.

What we like to create is a validation stage where a template is called which can be used for different resource groups. We have to pass the name of the RG to the template as a parameters, so we get:
```yml
stages:
  - stage: ValidateInfra
    displayName: 'Validate infra'
    jobs:
      - job: Validate_infra
        displayName: 'Validate infra for all environments'
        steps:
        - template: '/Pipelines/validate-infra.yml'
          parameters:
            deployment: '<RG>'
```
The template itself contains the validation steps for the TAP phases, containing the `AzureResourceGroupDeployment@2` step with `deploymentMode: 'Validation'`. It initally looks like:
```yml
parameters:
  - name: deployment
    type: string

steps:
    - task: AzureResourceGroupDeployment@2
      displayName: 'Validate ARM Template Test'
      inputs:
        azureSubscription: 'ServicePrincipalt'
        resourceGroupName: '{% raw %} ${{ parameters.deployment }} {% endraw %}t'
        location: 'West Europe'
        csmFile: 'infra/Deployment/{% raw %} ${{ parameters.deployment }} {% endraw %}/template.json'
        csmParametersFile: 'infra/Deployment/{% raw %} ${{ parameters.deployment \}\|/parameters.t.json'
        deploymentMode: 'Validation'

    - task: AzureResourceGroupDeployment@2
      displayName: 'Validate ARM Template Acc'
      inputs:
        azureSubscription: 'ServicePrincipala'
        resourceGroupName: '{% raw %} ${{ parameters.deployment }} {% endraw %}a'
        location: 'West Europe'
        csmFile: 'infra/Deployment/{% raw %} ${{ parameters.deployment \}\|/template.json'
        csmParametersFile: 'infra/Deployment/{% raw %} ${{ parameters.deployment \}\|/parameters.a.json'
        deploymentMode: 'Validation'

    - task: AzureResourceGroupDeployment@2
      displayName: 'Validate ARM Template Prod'
      inputs:
        azureSubscription: 'ServicePrincipalp'
        resourceGroupName: '{% raw %} ${{ parameters.deployment }} {% endraw %}p'
        location: 'West Europe'
        csmFile: 'infra/Deployment/{% raw %} ${{ parameters.deployment \}\|/template.json'
        csmParametersFile: 'infra/Deployment/{% raw %} ${{ parameters.deployment \}\|/parameters.p.json'
        deploymentMode: 'Validation'
```

and contains very similar steps. In fact, only the environmentname (`Test`, `Acc`, `Prod`) and environmentletters (`t`, `a`, `p`) are different! We can simplify this by adding the following [object parameter](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/runtime-parameters?view=azure-devops&tabs=script#parameter-data-types):

```yml
parameters:
  - name: environmentObjects
    type: object
    default: 
    - environmentName: 'Test'
      environmentLetter: 't'
    - environmentName: 'Acc'
      environmentLetter: 'a'
    - environmentName: 'Prod'
      environmentLetter: 'p'
```
We can then loop over this object 
```
  - {% raw %} ${{ each environmentObject in parameters.environmentObjects }} {% endraw %}:
```
and reference the parameters using the [compile-time variable expressions](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#understand-variable-syntax)
* `{% raw %} ${{ environmentObject.environmentName }} {% endraw %}`,
* `{% raw %} ${{ environmentObject.environmentLetter }} {% endraw %}`.

We now obtain for `template.yml`
```yml
parameters:
  - name: environmentObjects
    type: object
    default: 
    - environmentName: 'Test'
      environmentLetter: 't'
    - environmentName: 'Acc'
      environmentLetter: 'a'
    - environmentName: 'Prod'
      environmentLetter: 'p'

steps:
  - {% raw %} ${{ each environmentObject in parameters.environmentObjects }} {% endraw %}:
    - task: AzureResourceGroupDeployment@2
      displayName: 'Validate ARM Template {% raw %} ${{ environmentObject.environmentName }} {% endraw %}'
      inputs:
        azureSubscription: 'ServicePrincipal {% raw %} {% raw %} ${{ environmentObject.environmentName }} {% endraw %}'
        resourceGroupName: '{% raw %} ${{ parameters.deployment }} {% endraw %} {% raw %} ${{ environmentObject.environmentLetter }} {% endraw %}'
        location: 'West Europe'
        csmFile: 'infra/Deployment/{% raw %} ${{ parameters.deployment }} {% endraw %}/template.json'
        csmParametersFile: 'infra/Deployment/{% raw %} ${{ parameters.deployment }} {% endraw %}/parameters.{% raw %} ${{ environmentObject.environmentLetter }} {% endraw %}.json'
        deploymentMode: 'Validation'
```
which looks nice, compact and - not quite unimportant - works like a charm!

## Looping over stages - Rolling out infra
A likewise need for loops arises when *deploying to different environments*. To get successful infra deployments, I need the following jobs:
* A pre-deployment script (*e.g.* setting secrets in a keyvault),
* The deployment,
* A post-deployment script (to set access policies for Kubernetes *after is is successfully deployed*),
* infra tests after each of these steps.

These ensembles of tasks differ merely in parameters such as AzDo Service Principal, k8s namespace and resource group name. I have extracted all these steps in a `rollout-infra.yml` template. We can now loop over different stages using
```yml
parameters:
  - name: environmentObjects
    type: object
    default: 
    - environmentName: 'Test'
      environmentLetter: 't'
      variableGroup: 'TestSubscription'
    - environmentName: 'Dev'
      environmentLetter: 'd'
      variableGroup: 'DevelopmentSubscription'
    - environmentName: 'Prod'
      environmentLetter: 'p'
      variableGroup: 'ProductionSubscription'

stages:
  - {% raw %} ${{ each environmentObject in parameters.environmentObjects }} {% endraw %}:
    - stage: {% raw %} ${{ environmentObject.environmentName }} {% endraw %}
      condition: and(succeeded(), ne(variables['Build.Reason'], 'PullRequest'))
      displayName: 'Rollout infra {% raw %} ${{ environmentObject.environmentName }} {% endraw %}'
      variables:
        - group: {% raw %} ${{ environmentObject.variableGroup }} {% endraw %}
      jobs:
        - deployment: '{% raw %} ${{ environmentObject.environmentAzDo }} {% endraw %}'
          environment: '{% raw %} ${{ environmentObject.environmentAzDo }} {% endraw %}'
          displayName: 'Rollout infra {% raw %} ${{ environmentObject.environmentName }} {% endraw %}'
          strategy:
            runOnce:
              deploy:
                steps:
                  - checkout: self

                  - template: 'rollout-infra.yml'
                    parameters:
                      deployment: 'RG{% raw %} ${{ environmentObject.environmentLetter }} {% endraw %}'
                      environment: '{% raw %} ${{ environmentObject.environmentLetter }} {% endraw %}'
```

## Conclusion
The looping syntax `- {% raw %} ${{ each par in parameters.pars }} {% endraw %}` provides a useful twist to pipelines where the amount of code can be minimized. Loops are not limited to simple types, we can construct more complicated objects *containing the same properties* and loop over them. This can save a tremendous amount of lines of code and is more appealing to read and maintain. Keep in mind that the backslashes should be removed from the code examples.