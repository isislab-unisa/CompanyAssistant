import PropTypes from "prop-types";
import React from "react";
import { remove } from "../../../controllers/roleController";

// material-ui
import { makeStyles } from "@material-ui/styles";
import {
	Avatar,
	List,
	ListItem,
	Grid,
	ListItemAvatar,
	ListItemText,
	Typography,
	Menu,
	MenuItem,
} from "@material-ui/core";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

// project imports
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import MainCard from "../../ui-component/cards/MainCard";
import {
	Delete,
	Edit,
	RuleOutlined,
	ComputerOutlined,
	PersonOutline,
	PeopleOutline,
	Cloud,
	Storage,
} from "@material-ui/icons";
import TotalIncomeCard from "../../ui-component/cards/Skeleton/TotalIncomeCard";

// style constant
const useStyles = makeStyles((theme) => ({
	card: {
		overflow: "hidden",
		position: "relative",
		"&:after": {
			content: '""',
			position: "absolute",
			width: "210px",
			height: "210px",
			background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
			borderRadius: "50%",
			top: "-30px",
			right: "-180px",
		},
		"&:before": {
			content: '""',
			position: "absolute",
			width: "210px",
			height: "210px",
			background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
			borderRadius: "50%",
			top: "-160px",
			right: "-130px",
		},
	},
	content: {
		padding: "16px !important",
	},
	policies: {
		paddingTop: "10px !important",
	},
	policy: {
		padding: "0.5em !important",
	},
	avatar: {
		...theme.typography.commonAvatar,
		...theme.typography.largeAvatar,
		backgroundColor: theme.palette.warning.light,
		color: theme.palette.warning.dark,
		width: "2.5em",
		height: "2.5em",
		marginRight: "0.5em",
	},
	useButton: {
		margin: "0 auto",
		marginTop: "2em",
		backgroundColor: theme.palette.primary[500],
	},
	secondary: {
		color: theme.palette.grey[500],
		marginTop: "5px",
	},
	padding: {
		paddingTop: 0,
		paddingBottom: 0,
	},
	avatarRight: {
		...theme.typography.commonAvatar,
		...theme.typography.mediumAvatar,
		backgroundColor: theme.palette.orange.main,
		color: theme.palette.orange.dark,
		zIndex: 1,
		float: "right",
		boxShadow: "1px 1px 10px 0.2px rgba(140, 140, 140, 0.45)",
	},
}));

const RoleCard = ({ index, role, updateHandler, isLoading }) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const editHandler = () => {
		alert("DA IMPLEMENTARE");
		setAnchorEl(null);
	};
	const deleteHandler = () => {
		handleClose();
		remove((result, error) => {
			if (error != null) alert(error);
			else {
				//	openPopupDeletedHandler();
				updateHandler();
			}
		}, role.name);
		//setOpenPopup(!openPopup);
	};

	return (
		<>
			{isLoading ? (
				<TotalIncomeCard />
			) : (
				<MainCard
					border={true}
					className={classes.card}
					contentClass={classes.content}
				>
					<Grid container direction="row" justifyContent="space-between">
						<Grid item>
							<List className={classes.padding}>
								<ListItem
									alignItems="center"
									disableGutters
									className={classes.padding}
								>
									<ListItemAvatar>
										<Avatar variant="rounded" className={classes.avatar}>
											<RuleOutlined fontSize="large" />
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										sx={{
											mt: 0.45,
											mb: 0.45,
										}}
										className={classes.padding}
										primary={<Typography variant="h3">{role.name}</Typography>}
										secondary={
											<Typography variant="h5" className={classes.secondary}>
												policies
											</Typography>
										}
									/>
								</ListItem>
							</List>
						</Grid>
						<Grid item>
							<Avatar
								variant="rounded"
								className={classes.avatarRight}
								aria-controls="menu-earning-card"
								aria-haspopup="true"
								onClick={handleClick}
							>
								<MoreHorizIcon fontSize="inherit" />
							</Avatar>
							<Menu
								id="menu-earning-card"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleClose}
								variant="selectedMenu"
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
							>
								<MenuItem onClick={deleteHandler}>
									<Delete fontSize="inherit" className={classes.menuItem} />{" "}
									&nbsp; delete
								</MenuItem>
								<MenuItem onClick={editHandler}>
									<Edit fontSize="inherit" className={classes.menuItem} />{" "}
									&nbsp; edit
								</MenuItem>
							</Menu>
						</Grid>
					</Grid>
					<Grid
						container
						spacing={2}
						rowSpacing={4}
						className={classes.policies}
					>
						{role.policies !== undefined && role.policies !== null ? (
							role.policies.map((elem, index) => (
								<Grid item>
									<Stack direction="row" spacing={1}>
										<Chip
											size="small"
											className={classes.policy}
											icon={
												elem.toLowerCase().includes("vm") ? (
													<ComputerOutlined />
												) : elem.toLowerCase().includes("storage") ? (
													<Storage />
												) : elem.toLowerCase().includes("user") ? (
													<PersonOutline />
												) : elem.toLowerCase().includes("group") ? (
													<PeopleOutline />
												) : (
													<Cloud />
												)
											}
											label={elem}
											variant="filled"
										/>
									</Stack>
								</Grid>
							))
						) : (
							<span />
						)}
					</Grid>
				</MainCard>
			)}
		</>
	);
};

RoleCard.propTypes = {
	isLoading: PropTypes.bool,
};

export default RoleCard;
