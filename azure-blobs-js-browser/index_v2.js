// index.js
const { BlobServiceClient } = require("@azure/storage-blob");
// Now do something interesting with BlobServiceClient

const createContainerButton = document.getElementById("create-container-button");
const deleteContainerButton = document.getElementById("delete-container-button");
const selectButton = document.getElementById("select-button");
const fileInput = document.getElementById("file-input");
const listButton = document.getElementById("list-button");
const deleteButton = document.getElementById("delete-button");
const downloadButton = document.getElementById("download-button");
const status = document.getElementById("status");
const fileList = document.getElementById("file-list");
const download_table = document.getElementById("download-table");
const div_download_links_table = document.getElementById("div_download_links_table");
const div_container_file_list = document.getElementById("div_container_file_list");


div_download_links_table.style.display = "none";
div_container_file_list.style.display = "none";

const reportStatus = message => {
    status.innerHTML += `${message}<br/>`;
    status.scrollTop = status.scrollHeight;
}


// Update <placeholder> with your Blob service SAS URL string
const blobSasUrl = "https://ssssss212.blob.core.windows.net/?sv=2019-12-12&ss=b&srt=sco&sp=rwdlacx&se=2021-01-27T00:32:47Z&st=2021-01-14T16:32:47Z&spr=https&sig=q0HT8T5wJG3%2FDQ18QigRzRf7AQzTNijoNkQEcZh1VJg%3D";


// Create a new BlobServiceClient
const blobServiceClient = new BlobServiceClient(blobSasUrl);

// Create a unique name for the container by 
// appending the current time to the file name
//const containerName = "container" + new Date().getTime();
const containerName = "demo-container";

// Get a container client from the BlobServiceClient
const containerClient = blobServiceClient.getContainerClient(containerName);




const createContainer = async () => {
    try {
        reportStatus(`Creating container "${containerName}"...`);
        await containerClient.create();
        reportStatus(`Done.`);
    } catch (error) {
        reportStatus(error.message);
    }
};

const deleteContainer = async () => {
    try {
        reportStatus(`Deleting container "${containerName}"...`);
        await containerClient.delete();
        reportStatus(`Done.`);
    } catch (error) {
        reportStatus(error.message);
    }
};

createContainerButton.addEventListener("click", createContainer);
deleteContainerButton.addEventListener("click", deleteContainer);





const listFiles = async () => {
    fileList.size = 0;
    fileList.innerHTML = "";
    try {
        reportStatus("Retrieving file list...");
        let iter = containerClient.listBlobsFlat();
        let blobItem = await iter.next();
        while (!blobItem.done) {
            fileList.size += 1;
            fileList.innerHTML += `<option> ${blobItem.value.name} </option>`;
			//alert(blobItem.url);
           blobItem = await iter.next();
        }
        if (fileList.size > 0) {
            reportStatus("Done.");
        } else {
            reportStatus("The container does not contain any files.");
        }
    } catch (error) {
        reportStatus(error.message);
    }
	
	div_download_links_table.style.display = "none";
	div_container_file_list.style.display = "block";
	
};

listButton.addEventListener("click", listFiles);






const uploadFiles = async () => {
    try {
        reportStatus("Uploading files...");
        const promises = [];
        for (const file of fileInput.files) {
            const blockBlobClient = containerClient.getBlockBlobClient(file.name);
            promises.push(blockBlobClient.uploadBrowserData(file));
        }
        await Promise.all(promises);
        reportStatus("Done.");
        listFiles();
    }
    catch (error) {
            reportStatus(error.message);
    }
	
}

selectButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", uploadFiles);





const deleteFiles = async () => {
    try {
        if (fileList.selectedOptions.length > 0) {
            reportStatus("Deleting files...");
            for (const option of fileList.selectedOptions) {
                await containerClient.deleteBlob(option.text);
            }
            reportStatus("Done.");
            listFiles();
        } else {
            reportStatus("No files selected.");
        }
    } catch (error) {
        reportStatus(error.message);
    }
};

deleteButton.addEventListener("click", deleteFiles);





const downloadFiles = async () => {
	
	download_table.size = 0;
    download_table.innerHTML = "";
			
    try {
        reportStatus("Populating Download links list...");
        let iter = containerClient.listBlobsFlat();
        let blobItem = await iter.next();
		
		download_table.innerHTML += '<tr><th>Blob Name</th> <th> Download Link </th> </tr>'
		
		
        while (!blobItem.done) {
            download_table.size += 1;
            //downloadlist.innerHTML += `<option> ${blobItem.value.name} </option>`;
			const blobClient = containerClient.getBlobClient(blobItem.value.name);
            download_table.innerHTML += `<tr> <td> ${blobItem.value.name} </td> <td>  <a href=' ${blobClient.url} '> ${blobClient.url} </a>  </td></tr>`;
			blobItem = await iter.next();
        }
        if (fileList.size > 0) {
            reportStatus("Done.");
        } else {
            reportStatus("The container does not contain any files.");
        }
    } catch (error) {
        reportStatus(error.message);
    }
	
	div_download_links_table.style.display = "block";
	div_container_file_list.style.display = "none";

	
};

downloadButton.addEventListener("click", downloadFiles);
