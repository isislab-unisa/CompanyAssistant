import React from "react";
import Image from 'next/image'

import logo from "./../../assets/images/logo.png";

const Logo = () => {
	return <Image src={logo} alt="Berry" width="185" height='75px' style={{marginTop:'7px'}} />;
};

export default Logo;
