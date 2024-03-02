import Shop from './pages/shop/Shop';
import Layout from './components/layout/Layout';
import Header from './components/header/Header';

function App() {
	return (
		<>
			<Header />
			<Layout>
				<Shop />
			</Layout>
		</>
	);
}

export default App;
