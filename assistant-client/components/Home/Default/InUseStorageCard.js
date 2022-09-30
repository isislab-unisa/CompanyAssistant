import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
	Box,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from "@mui/material";

import MainCard from "../../ui-component/cards/MainCard";
import TotalIncomeCard from "../../ui-component/cards/Skeleton/TotalIncomeCard";
import { makeStyles } from "@material-ui/styles";
import { getStorage } from "../../../controllers/storageController";

const useStyles = makeStyles((theme) => ({
	card: {
		overflow: "hidden",
		position: "relative",
		"&:after": {
			content: '""',
			position: "absolute",
			width: 210,
			height: 210,
			background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
			borderRadius: "50%",
			top: -30,
			right: -180,
		},
		"&:before": {
			content: '""',
			position: "absolute",
			width: 210,
			height: 210,
			background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
			borderRadius: "50%",
			top: -160,
			right: -130,
		},
	},
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const InUseStorageCard = () => {
	const theme = useStyles();
	const [isLoading, setLoading] = useState(true);
	const [storage, setStorage] = useState([]);

	useEffect(() => {
		if (!isLoading) return;
		setLoading(true);
		getStorage((result, error) => {
			if (error != null) {
				alert(error);
			} else {
				console.log(result);
				setStorage(result);
				setLoading(false);
			}
		});
	}, [isLoading]);
	return (
		<>
			{isLoading ? (
				<TotalIncomeCard />
			) : (
				<MainCard
					border={true}
					className={theme.card}
					contentClass={theme.content}
					content={false}
				>
					<Box sx={{ p: 2 }}>
						<List sx={{ py: 0 }}>
							<ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
								<ListItemAvatar></ListItemAvatar>
								<ListItemText
									sx={{
										py: 0,
										mt: 0.45,
										mb: 0.45,
									}}
									primary={
										<Typography variant="h4">{storage.length}</Typography>
									}
									secondary={
										<Typography
											variant="subtitle2"
											sx={{
												mt: 0.5,
											}}
										>
											Storage in use
										</Typography>
									}
								/>
							</ListItem>
						</List>
					</Box>
				</MainCard>
			)}
		</>
	);
};

InUseStorageCard.propTypes = {
	isLoading: PropTypes.bool,
};

export default InUseStorageCard;
