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
    $rgname = Get-AutomationVariable -Name 'reourcegroupname_var'
    if ($rgname -eq $null)
    {
        Write-Output "Variable entered: $rgname does not exist in the automation service. Please create one `n"   
    }
    else
    {
        Write-Output "Variable Properties: "
        Write-Output "Variable Value: $rgname `n"
    }




$vm = Get-AzVm -ResourceGroupName $rgname

echo "You VM:" $vm

echo "Stopping the VM"
$vm | Stop-AzVm -force

echo "End of the job"

