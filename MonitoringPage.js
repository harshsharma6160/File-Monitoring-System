import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const App = () => {
  const [directories, setDirectories] = useState([""]);
  const [files, setFiles] = useState([""]);
  const [responseMessage, setResponseMessage] = useState("");

  const handleDirectoryChange = (index, value) => {
    const newDirs = [...directories];
    newDirs[index] = value;
    setDirectories(newDirs);
  };

  const handleFileChange = (index, value) => {
    const newFiles = [...files];
    newFiles[index] = value;
    setFiles(newFiles);
  };

  const addDirectoryInput = () => setDirectories([...directories, ""]);
  const removeDirectoryInput = (index) => {
    const newDirs = [...directories];
    newDirs.splice(index, 1);
    setDirectories(newDirs);
  };

  const addFileInput = () => setFiles([...files, ""]);
  const removeFileInput = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/start-monitoring", {
        directories: directories.filter((d) => d.trim() !== ""),
        files: files.filter((f) => f.trim() !== ""),
      });
      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage("Error: Could not start monitoring.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box sx={{
    p: 4,
    background: "#E0FFFF", // Light blue with transparency
    boxShadow: "0px 4px 15px rgba(0, 255, 255, 0.7)" , // Bright cyan glow
// Subtle glow
    borderRadius: 3,
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto",
    color: "black", // Text color
  }}>

        <Typography variant="h4" gutterBottom>
          File Monitoring System
        </Typography>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6">Directories to Monitor</Typography>
          {directories.map((dir, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", my: 2 }}>
              <TextField
                fullWidth
                label={`Directory ${idx + 1}`}
                value={dir}
                onChange={(e) => handleDirectoryChange(idx, e.target.value)}
              />
              <IconButton color="error" onClick={() => removeDirectoryInput(idx)}>
                <RemoveCircle />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddCircle />} onClick={addDirectoryInput}>
            Add More Directories
          </Button>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Files to Monitor
          </Typography>
          {files.map((file, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", my: 2 }}>
              <TextField
                fullWidth
                label={`File ${idx + 1}`}
                value={file}
                onChange={(e) => handleFileChange(idx, e.target.value)}
              />
              <IconButton color="error" onClick={() => removeFileInput(idx)}>
                <RemoveCircle />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddCircle />} onClick={addFileInput}>
            Add More Files
          </Button>

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            Start Monitoring
          </Button>
        </form>
        {responseMessage && <Alert severity="info" sx={{ mt: 3 }}>{responseMessage}</Alert>}
      </Box>
    </Container>
  );
};

export default App;

