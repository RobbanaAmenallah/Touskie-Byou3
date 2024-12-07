import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from "./Content";

function Template(props) {
  return (
    <>
      <Header />
      <Content>{props.children}</Content>
      <Footer />
    </>
  );
}

export default Template;
