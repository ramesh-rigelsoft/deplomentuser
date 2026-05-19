// import React from 'react';
import React,{ useState,useEffect } from "react";
import Main from './components/Main';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FileViewerComponent } from "./components/FilePreview";

function App() {
   const host = window.location.hostname;
	if (host !== "localhost") {
		window.location.replace("http://127.0.0.0:8131");
		return null; // stop rendering
	}
  return (
    	<div>
	    	<Main/>
			<ToastContainer />
			<FileViewerComponent />
	    </div>
  );
}

export default App;
