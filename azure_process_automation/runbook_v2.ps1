#Creating the connection
$connectionName = "AzureRunAsConnection"
try
{
    # Get the connection "AzureRunAsConnection "
    $servicePrincipalConnection=Get-AutomationConnection -Name $connectionName         

    "Logging in to Azure..."
    Add-AzAccount `
        -ServicePrincipal `
        -TenantId $servicePrincipalConnection.TenantId `
        -ApplicationId $servicePrincipalConnection.ApplicationId `
        -CertificateThumbprint $servicePrincipalConnection.CertificateThumbprint 
}
catch {
    if (!$servicePrincipalConnection)
    {
        $ErrorMessage = "Connection $connectionName not found."
        throw $ErrorMessage
    } else{
        Write-Error -Message $_.Exception
        throw $_.Exception
    }
}




#Reading the Variables
    $Var = Get-AutomationVariable -Name 'reourcegroupname_var'
    if ($Var -eq $null)
    {
        Write-Output "Variable entered: $reourcegroupname_var does not exist in the automation service. Please create one `n"   
    }
    else
    {
        Write-Output "Variable Properties: "
        Write-Output "Variable Value: $Var `n"
    }




#Get all ARM resources from all resource groups
$Resources = Get-AzResource -ResourceGroupName $Var
$Resources  | select Name, Type | Out-String

echo "End of the job"

