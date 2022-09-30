
import { useEffect } from 'react'
import Head from 'next/head'
import { isLogged } from "../controllers/loginController"
import "bootstrap/dist/css/bootstrap.min.css";
import dynamic from 'next/dynamic'


// import {Header}  from '../components/Header';
// import {Layout}  from '../components/layout';

export default function Info() {

  const Header = dynamic(() => import('../components/header'));
  const Layout = dynamic(() => import('../components/layout'));


  if (!isLogged()) {
    useEffect(() => { window.location.href = "/login"; })
    return (<></>);
  } else {
    return (
      <>
        <Head>
          <title>Info</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header selected="Info"></Header>
        <Layout>

          <div>
            <h1 className="h3 mb-3 font-weight-normal">Bot</h1>
            <br /><br /><br />
            <br /><br /><br />
            <br /><br /><br />
            <br /><br /><br />
            <br /><br /><br />
            <br /><br /><br />
            <br /><br /><br />
            <br /><br /><br />
          </div>
        </Layout>
      </>
    );
  }

}
