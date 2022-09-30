import { useSelector } from "react-redux";
import { ThemeProvider } from "@material-ui/core/styles";
import MainLayout from "../components/layout/MainLayout/index";
import themes from "../themes/index";
import CreateRole from "../components/Role/CreateRole/index";

import { CssBaseline } from "@material-ui/core";
import "bootstrap/dist/css/bootstrap.min.css";
export default function createRolePage() {
	const customization = useSelector((state) => state.customization);

	return (
		<ThemeProvider theme={themes(customization)}>
			<CssBaseline />
			<MainLayout>
				<CreateRole></CreateRole>
			</MainLayout>
		</ThemeProvider>
	);
}
