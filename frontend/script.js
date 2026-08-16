// ======================================================
// Cloud File Storage
// ======================================================

// Replace this with your API Gateway invoke URL.

const API_URL =
    "https://dtm7rl4x9e.execute-api.ap-southeast-2.amazonaws.com/prod";


// ======================================================
// DOM Elements
// ======================================================

const fileInput =
    document.getElementById("fileInput");

const uploadButton =
    document.getElementById("uploadButton");

const uploadStatus =
    document.getElementById("uploadStatus");

const fileList =
    document.getElementById("fileList");

const refreshButton =
    document.getElementById("refreshButton");


// ======================================================
// Load files when page opens
// ======================================================

window.addEventListener(
    "DOMContentLoaded",
    loadFiles
);


// ======================================================
// Upload button
// ======================================================

uploadButton.addEventListener(
    "click",
    uploadFile
);


// ======================================================
// Refresh button
// ======================================================

refreshButton.addEventListener(
    "click",
    loadFiles
);


// ======================================================
// Load files
// ======================================================

async function loadFiles() {

    fileList.innerHTML =
        "<p>Loading files...</p>";

    try {

        const response =
            await fetch(
                `${API_URL}/files`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load files"
            );
        }

        displayFiles(
            data.files || []
        );

    } catch (error) {

        console.error(error);

        fileList.innerHTML = `
            <p class="error">
                Failed to load files.
            </p>
        `;
    }
}


// ======================================================
// Display files
// ======================================================

function displayFiles(files) {

    if (files.length === 0) {

        fileList.innerHTML =
            "<p>No files uploaded yet.</p>";

        return;
    }

    fileList.innerHTML = "";

    files.forEach(
        file => {

            const fileItem =
                document.createElement(
                    "div"
                );

            fileItem.className =
                "file-item";

            const size =
                formatFileSize(
                    file.size
                );

            fileItem.innerHTML = `
                <div>
                    <div class="file-name">
                        ${escapeHtml(file.name)}
                    </div>

                    <small>
                        ${size}
                    </small>
                </div>

                <div class="file-actions">

                    <button
                        onclick="downloadFile(
                            '${encodeURIComponent(file.name)}'
                        )">
                        Download
                    </button>

                    <button
                        onclick="deleteFile(
                            '${encodeURIComponent(file.name)}'
                        )">
                        Delete
                    </button>

                </div>
            `;

            fileList.appendChild(
                fileItem
            );
        }
    );
}


// ======================================================
// Upload file
// ======================================================

async function uploadFile() {

    const file =
        fileInput.files[0];

    if (!file) {

        uploadStatus.textContent =
            "Please select a file first.";

        uploadStatus.className =
            "error";

        return;
    }

    uploadStatus.textContent =
        "Uploading...";

    uploadStatus.className = "";


    try {

        const response =
            await fetch(
                `${API_URL}/upload?filename=${encodeURIComponent(file.name)}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            file.type ||
                            "application/octet-stream"
                    },

                    body: file
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Upload failed"
            );
        }

        uploadStatus.textContent =
            "File uploaded successfully.";

        uploadStatus.className =
            "success";

        fileInput.value = "";

        await loadFiles();

    } catch (error) {

        console.error(error);

        uploadStatus.textContent =
            error.message || "Upload failed.";

        uploadStatus.className =
            "error";
    }
}


// ======================================================
// Download file
// ======================================================

async function downloadFile(
    encodedFileName
) {

    const fileName =
        decodeURIComponent(
            encodedFileName
        );

    try {

        const response =
            await fetch(
                `${API_URL}/download?filename=${encodeURIComponent(fileName)}`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Download failed"
            );
        }

        window.open(
            data.downloadUrl,
            "_blank"
        );

    } catch (error) {

        console.error(error);

        alert(
            "Unable to download the file."
        );
    }
}


// ======================================================
// Delete file
// ======================================================

async function deleteFile(encodedFileName) {

    const fileName =
        decodeURIComponent(encodedFileName);

    const confirmed =
        confirm(`Delete "${fileName}"?`);

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/files?filename=${encodeURIComponent(fileName)}`,
            {
                method: "DELETE"
            }
        );

        console.log("DELETE status:", response.status);

        const data = await response.json();

        console.log("DELETE response:", data);

        // If the server actually deleted the file,
        // refresh the list.
        if (data.success === true) {

            alert(`"${fileName}" deleted successfully.`);

            await loadFiles();

            return;
        }

        throw new Error(
            data.message || "Delete failed"
        );

    } catch (error) {

        console.error("DELETE ERROR:", error);

        // Only show the error if the request genuinely failed.
        alert(`Unable to delete "${fileName}".`);
    }
}
// ======================================================
// Format file size
// ======================================================

function formatFileSize(
    bytes
) {

    if (bytes === 0) {

        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );

    const size =
        bytes /
        Math.pow(
            1024,
            index
        );

    return (
        size.toFixed(2) +
        " " +
        units[index]
    );
}


// ======================================================
// Basic HTML escaping
// ======================================================

function escapeHtml(
    text
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;
}