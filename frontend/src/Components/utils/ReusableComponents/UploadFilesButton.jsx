import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Divider, Paper } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const handleUploadSuccess = (data) => {
  alert(`Uploaded PDF with ${data.pages} pages and size ${data.size} KB.`);
};

export default function UploadFilesButton({ uploadUrl, onUploadSuccess }) {
  const [fileInfo, setFileInfo] = useState(null);

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    const file = files[0];
    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Upload failed with status:",
          response.status,
          "Response:",
          errorText
        );
        throw new Error("Failed to upload file.");
      }

      const data = await response.json();
      setFileInfo(data);
      console.log(data);
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (error) {
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        console.error("Network error or CORS issue:", error);
        alert(
          "Network error or server is unreachable. Please check your connection or contact support."
        );
      } else {
        console.error("Error uploading file:", error);
        alert("Error uploading file. Please try again.");
      }
    }
  };

  return (
    <div>
      <Divider />
      <Paper rounded={false} sx={{ padding: 2, marginTop: 2 }}>
        <Button
          component="label"
          variant="text"
          color="info"
          startIcon={<CloudUploadIcon />}
        >
          Validar PDF
          <VisuallyHiddenInput
            type="file"
            accept="application/pdf"
            onChange={(event) => handleFileUpload(event.target.files)}
          />
        </Button>

        {fileInfo && (
          <List title={fileInfo.pdf_info.filename} sx={{ marginTop: 2 }}>
            {fileInfo.pages_info.map((file) => (
              <ListItem key={file.id}>
                <ListItemText
                  primary={`Pagina: ${file.page_number}`}
                  secondary={`Tamaño: ${Math.round(
                    file.trim_width_mm
                  )} x ${Math.round(file.trim_height_mm)} mm`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </div>
  );
}
