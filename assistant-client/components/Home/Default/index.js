import { useEffect, useState } from "react";

// material-ui
import { Grid } from "@mui/material";

// project imports
import WelcomeCard from "./welcomeCard";
import StartedVms from "./StartedVms";
import InUseStorageCard from "./InUseStorageCard";
import { gridSpacing } from "../../../store/constant";
import GroupsCard from "./GroupsCard";
import MachinesCard from "./MachinesCard";
import StoragesCard from "./StoragesCard";

const Dashboard = () => {
	const [isLoading, setLoading] = useState(true);
	useEffect(() => {
		setLoading(false);
	}, []);

	return (
		<Grid container spacing={gridSpacing}>
			<Grid item xs={12}>
				<Grid container spacing={gridSpacing}>
					<Grid item lg={8} md={12} sm={12} xs={12}>
						<WelcomeCard isLoading={isLoading} />
					</Grid>

					<Grid item lg={4} md={12} sm={12} xs={12}>
						<Grid container spacing={gridSpacing}>
							<Grid item sm={6} xs={12} md={6} lg={12}>
								<StartedVms isLoading={isLoading} />
							</Grid>
							<Grid item sm={6} xs={12} md={6} lg={12}>
								<InUseStorageCard />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Grid container spacing={gridSpacing}>
					<Grid item xs={12} md={4}>
						<GroupsCard />
					</Grid>
					<Grid item xs={12} md={4}>
						<MachinesCard isLoading={isLoading} />
					</Grid>
					<Grid item xs={12} md={4}>
						<StoragesCard isLoading={isLoading} />
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Dashboard;
