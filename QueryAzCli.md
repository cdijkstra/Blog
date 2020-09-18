# Querying Azure cli output
The Azure client calls the Azure REST API and allows us to retrieve information about deployed resources in the terminal.\
For instance, we can run the following command to obtain information about an AKS cluster:\
\
`az aks get-upgrades --resource-group <rg-name> --name <aks-name>`\
(or more complactly:\
`az aks get-upgrades -g <rg-name> -n <aks-name>`).\
\
This returns something like:
```
{
  "agentPoolProfiles": [
    {
      "kubernetesVersion": "1.16.13",
      "name": null,
      "osType": "Linux",
      "upgrades": [
        {
          "isPreview": null,
          "kubernetesVersion": "1.17.7"
        },
        {
          "isPreview": null,
          "kubernetesVersion": "1.17.9"
        }
      ]
    }
  ],
  "controlPlaneProfile": {
    "kubernetesVersion": "1.16.13",
    "name": null,
    "osType": "Linux",
    "upgrades": [
      {
        "isPreview": null,
        "kubernetesVersion": "1.17.7"
      },
      {
        "isPreview": true,
        "kubernetesVersion": "1.17.9"
      }
    ]
  },
  (...)
}
```
We are probably interested in the versions we can upgrade the cluster to, so let's obtain these versions.
A solution would be to pipe the output to `jq`, [a sed-like command tool for json output](https://stedolan.github.io/jq/), to obtain the right json properties of the controlPlaneProfile.\
\
Indeed, adding the following pipe to the to the `az aks` command `| jq '.controlPlaneProfile.upgrades[].kubernetesVersion'`gives us the desired output. For instance:
```
"1.17.7"
"1.17.9"
```
## Azure cli querying
We can also use the built-in `--query` flag to obtain the right json properties of the controlPlaneProfile by setting `--query controlPlaneProfile.upgrades[].kubernetesVersion`. Why? One benefit is clear, we don't need to pipe any output and use a simple one-liner. But there are more advantages! 
### Filtering the output
Another advantage is that this way of querying data is pretty powerful, let's say that we want to filer all the preview versions. We can [filter arrays](https://docs.microsoft.com/en-us/cli/azure/query-azure-cli?view=azure-cli-latest#filter-arrays) by only displaying values whenever isPreview is set to null.\
\
The upgrades array can be filtered as follows \
`[?isPreview==null].kubernetesVersion`\
and now only returns "1.17.7". All logical operators and comparison operators are supported and additionally some built-in functions like `floor`, `join`, `max`, `contains` and many [other functions](https://jmespath.org/specification.html#built-in-functions). 
Quite nice already, isn't it?

Moreover we can change the output format, the default being json. If we want to do something with the output in a script or pipeline the tab-separated output would be handier: ` -o tsv`.\
We can now set the bash variable 
```
availableNonpreviewUpgrades=`az aks get-upgrades -g <rg-name> -n <aks-name> --query controlPlaneProfile.upgrades[?isPreview==null].kubernetesVersion -o tsv`
```
and post the available upgrades with
```
echo "Available upgrades for AKS: $availableNonpreviewUpgrades"
```
Other useful output formats for Azure CLI commands are `table`, `none` (if you only want to be informed about warnings/errors) and perhaps you'll even use `yaml` one day.