// File - /components/Layout.js
import Header from "./header";
import Footer from "./footer";
import { Container } from 'react-bootstrap'

const layoutStyle = {
};

const contentStyle = {
    maxWidth: "100%",
    minWidth: "90%"
};

const Layout = props => (
    <>
        <Container className="Content container" style={contentStyle}>
            {props.children}
        </Container>
        <Footer />
    </>
);

export default Layout;