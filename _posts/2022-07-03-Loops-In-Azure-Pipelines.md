---
layout: post
title:  "Loops in Azure Pipelines"
date: '2022-07-03 15:45:00 +0100'
tags: devops azure-pipelines loops
image: pipelines.png
---

## The benefit of loops in Azure Pipelines
A common situation when creating pipelines is when similar steps should take place for different enviroments. For instance, in CI/CD pipelines we often want to deploy to an Azure Web App or Kubernetes cluster for different environments. To minimize the amount of code and/or configuration, I like to apply the DRY principle besides code to IaC and pipeline configuration too. In Azure pipelines we can easily do so by looping over `object` parameters!

## Code examples
### Looping over steps - Validating an infra deployment
When using ARM or bicep templates, it is a good practice to validate if the template + corresponding parameter files are syntactically correct. We do using the `az group deployment validate --template-file <template.yml> -- parameters <parameters.{d,t,p}>` command. I like to validate if it's valid for all environments beforing continuing to any of the deployments.

What we like to create is a validation stage where a template is called which can be used for different resource groups. We have to pass the name of the RG to the template as a parameters, so we get:
```
stages:
  - stage: ValidateInfra
    displayName: 'Validate infra'
    jobs:
      - job: Validate_infra
        displayName: 'Validate infra for all environments'
        steps:
        - template: '../../CmcBs/Pipelines/validate-infra.yml'
          parameters:
            deployment: '<RG>'
```
The template contains the validation steps for the TAP (Testing, Acceptance and Production) phases

The template contains the `AzureResourceGroupDeployment@2` step with `deploymentMode: 'Validation'`. It initally looks like:
```
parameters:
  - name: deployment
    type: string

steps:
    - task: AzureResourceGroupDeployment@2
      displayName: 'Validate ARM Template Test'
      inputs:
        azureSubscription: 'ServicePrincipalt'
        resourceGroupName: '${{ parameters.deployment }}t'
        location: 'West Europe'
        csmFile: 'infra/Deployment/${{ parameters.deployment }}/template.json'
        csmParametersFile: 'infra/Deployment/${{ parameters.deployment }}/parameters.t.json'
        deploymentMode: 'Validation'

    - task: AzureResourceGroupDeployment@2
      displayName: 'Validate ARM Template Acc'
      inputs:
        azureSubscription: 'ServicePrincipala'
        resourceGroupName: '${{ parameters.deployment }}a'
        location: 'West Europe'
        csmFile: 'infra/Deployment/${{ parameters.deployment }}/template.json'
        csmParametersFile: 'infra/Deployment/${{ parameters.deployment }}/parameters.a.json'
        deploymentMode: 'Validation'

    - task: AzureResourceGroupDeployment@2
      displayName: 'Validate ARM Template Prod'
      inputs:
        azureSubscription: 'ServicePrincipalp'
        resourceGroupName: '${{ parameters.deployment }}p'
        location: 'West Europe'
        csmFile: 'infra/Deployment/${{ parameters.deployment }}/template.json'
        csmParametersFile: 'infra/Deployment/${{ parameters.deployment }}/parameters.p.json'
        deploymentMode: 'Validation'
```

and contains very similar steps. In fact, only the environmentname (`Test`, `Acc`, `Prod`) and environmentletters (`t`, `a`, `p`) are different! We can simplify this by adding the following [object parameter](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/runtime-parameters?view=azure-devops&tabs=script#parameter-data-types):
```
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
We can then loop over this object, and reference the parameters using `${{ environmentObject.environmentName }}` and `${{ environmentObject.environmentLetter }}`!

```
parameters:
  - name: deployment
    type: string
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
  - ${{ each environmentObject in parameters.environmentObjects }} :
    - task: AzureResourceGroupDeployment@2
      displayName: 'Validate ARM Template ${{ environmentObject.environmentName }}'
      inputs:
        azureSubscription: 'ServicePrincipal${{ environmentObject.environmentName }}'
        resourceGroupName: '${{ parameters.deployment }}${{ environmentObject.environmentLetter }}'
        location: 'West Europe'
        csmFile: 'infra/Deployment/${{ parameters.deployment }}/template.json'
        csmParametersFile: 'infra/Deployment/${{ parameters.deployment }}/parameters.${{ environmentObject.environmentLetter }}.json'
        deploymentMode: 'Validation'
```

### Looping over stages - Rolling out infra
A similar situation happens for deploying to different environments. To get successful infra deployments, most likely you need
* A pre-deployment script (*e.g.* setting secrets in a keyvault)
* The deployment
* A post-deployment script (to set access policies for Kubernetes *after is is successfully deployed*)
* infra tests after each of these steps.

I have extracted all these steps in a `validate-infra.yml` template. We can now loop over different stages using
```
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

  (...)

stages:
  - ${{ each environmentObject in parameters.environmentObjects }} :
    - stage: ${{ environmentObject.environmentName }}
      condition: and(succeeded(), ne(variables['Build.Reason'], 'PullRequest'))
      displayName: 'Rollout infra ${{ environmentObject.environmentName }}'
      variables:
        - group: ${{ environmentObject.variableGroup }}
      jobs:
        - deployment: '${{ environmentObject.environmentAzDo }}'
          environment: '${{ environmentObject.environmentAzDo }}'
          displayName: 'Rollout infra ${{ environmentObject.environmentName }}'
          strategy:
            runOnce:
              deploy:
                steps:
                  - checkout: self

                  - template: 'rollout-infra.yml'
                    parameters:
                      deployment: 'RG'
                      environment: '${{ environmentObject.environmentLetter }}
```