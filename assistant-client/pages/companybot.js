
import { useEffect } from 'react'
import Head from 'next/head'
import { isLogged } from "../controllers/loginController"
import "bootstrap/dist/css/bootstrap.min.css";
import dynamic from 'next/dynamic'

export default function CompanyBot() {

  const Header = dynamic(() => import('../components/header'));
  const Layout = dynamic(() => import('../components/layout'));


  if (!isLogged()) {
    useEffect(() => { window.location.href = "/login"; })
    return (<></>);
  } else {
    return (
      <>
        <Head>
          <title>CompanyBot</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header selected="CompanyBot"></Header>
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
