import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";

import AddIcon from "@material-ui/icons/Add";
import Zoom from "@material-ui/core/Zoom";

import axios from "axios";
import { createUser } from "../services/UserService";

function CreateArea(props) {
	const [isExpanded, setIsExpanded] = useState(false);

	const [notesData, setNotesData] = useState({
		title: "",
		content: "",
	});

	function handleChange(event) {
		const { name, value } = event.target;
		setNotesData((prevValue) => {
			return {
				...prevValue,
				[name]: value,
			};
			
		});
	}


	function expand() {
		setIsExpanded(true);
	}

	function submit(event) {
		event.preventDefault();

		if (notesData.title === "") {
			alert("Title Cannot Be Empty");
		} else if (notesData.content === "") {
			alert("Content Cannot Be Empty");
		} else {
			props.addingItems(notesData);
			setNotesData({
				title: "",
				content: "",
			});
		}
	}

	return (
		<div>
			<form className="create-note" required>
				{isExpanded && (
					<input
						onChange={handleChange}
						//   onChange={handleTitleChange}
						type="text"
						name="title"
						placeholder="Title"
						value={notesData.title}
					/>
				)}
				<textarea
					onClick={expand}
					onChange={handleChange}
					//   onChange={handleContentChange}
					name="content"
					placeholder="Take a note..."
					rows={isExpanded ? "3" : "1"}
					value={notesData.content}
				/>
				<Zoom in={isExpanded}>
					<Fab type="submit" onClick={submit}>
						<AddIcon />
					</Fab>
				</Zoom>
			</form>
		</div>
	);
}

export default CreateArea;
