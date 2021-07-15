
import React from "react";

function Footer() {
	const customStyle = { position: "fixed" };
	const year = new Date().getFullYear();
	return (
		<footer>
			<p style={customStyle}>Copyright ⓒ {year}</p>
		</footer>
	);
}

export default Footer;
