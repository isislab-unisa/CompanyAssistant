import React, { useEffect, useState } from "react";

// material-ui
import { Grid } from "@material-ui/core";

// project imports
import AccountCard from "./AccountCard";
import { getAccounts } from "../../../controllers/accountController";
import { gridSpacing } from "../../../store/constant";

const AccountContainer = () => {
	const [isLoading, setLoading] = useState(true);
	const [accounts, setAccounts] = useState([]);
	useEffect(() => {
		if (!isLoading) return;
		getAccounts((result, error) => {
			if (error != null) {
				alert(error);
			} else {
				console.log(result);
				setAccounts(result);
				setLoading(false);
			}
		});
	}, [isLoading]);

	const updateContent = () => {
		setLoading(!isLoading);
	};

	if (isLoading) return <h1>Loading...</h1>;
	else
		return (
			<Grid container spacing={gridSpacing}>
				{accounts.map((element) => (
					<Grid item lg={4} sm={6} md={6} xs={12}>
						<AccountCard
							account={element}
							isLoading={isLoading}
							updateHandler={updateContent}
						/>
					</Grid>
				))}
			</Grid>
		);
};

export default AccountContainer;
