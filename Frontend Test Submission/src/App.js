import React, { useState } from "react";
import {
  Container, TextField, Button, Typography, Card, CardContent
} from "@mui/material";
import axios from "axios";

function App() {
  const [urls, setUrls] = useState([""]);
  const [results, setResults] = useState([]);

  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, ""]);
    }
  };

  const shortenUrls = async () => {
    const responses = [];
    for (let url of urls) {
      if (url.trim()) {
        const res = await axios.post("http://localhost:5000/shorturls", {
          url,
          validity: 30
        });
        responses.push(res.data);
      }
    }
    setResults(responses);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {urls.map((url, i) => (
        <TextField
          key={i}
          label="Enter URL"
          fullWidth
          margin="normal"
          value={url}
          onChange={(e) => handleChange(i, e.target.value)}
        />
      ))}

      <Button onClick={addUrl} variant="outlined" disabled={urls.length >= 5}>
        Add More
      </Button>
      <Button onClick={shortenUrls} variant="contained" sx={{ ml: 2 }}>
        Shorten
      </Button>

      {results.map((res, i) => (
        <Card key={i} sx={{ mt: 2 }}>
          <CardContent>
            <Typography>Short Link: {res.shortLink}</Typography>
            <Typography>Expiry: {res.expiry}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default App;
