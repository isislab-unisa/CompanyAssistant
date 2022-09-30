import PropTypes from "prop-types";
import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@material-ui/core/styles";
import InfoModal from "../../ui-component/infoModal";
import dangerImage from "../../../assets/images/danger.png";
import { remove } from "../../../controllers/accountController";

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

// project imports
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import MainCard from "../../ui-component/cards/MainCard";
import { Delete, Edit, PersonOutlineOutlined } from "@material-ui/icons";

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

const AccountCard = ({ account, isLoading, updateHandler }) => {
	const classes = useStyles();
	const theme = useTheme();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const [openPopup, setOpenPopup] = useState(false);
	const [openPopupDelete, setOpenPopupDelete] = useState(false);
	const [openPopupDeleted, setOpenPopupDeleted] = useState(false);

	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const openPopupHandler = () => {
		setOpenPopup(!openPopup);
	};

	const openPopupDeleteHandler = () => {
		handleClose();
		setOpenPopupDelete(!openPopupDelete);
	};

	const openPopupDeletedHandler = () => {
		handleClose();
		setOpenPopupDeleted(!openPopupDeleted);
	};

	const handlerDelete = () => {
		setOpenPopupDelete(false);
		remove((result, error) => {
			if (error != null) alert(error);
			else {
				openPopupDeletedHandler();
				updateHandler();
			}
		}, account);
		setOpenPopupDelete(false);
		updateHandler();
	};

	return (
		<>
			{isLoading ? (
				<TotalIncomeCard />
			) : (
				<>
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
												<PersonOutlineOutlined fontSize="large" />
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											sx={{
												mt: 0.45,
												mb: 0.45,
											}}
											className={classes.padding}
											primary={
												<Typography variant="h3">{account.name}</Typography>
											}
											secondary={
												<Typography variant="h5" className={classes.secondary}>
													{account.provider}
													<br />
													{account.status}
													<br />
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
									<MenuItem onClick={openPopupDeleteHandler}>
										<Delete fontSize="inherit" className={classes.menuItem} />{" "}
										&nbsp; delete
									</MenuItem>
									<MenuItem
										onClick={() => {
											alert("DA IMPLEMENTARE");
										}}
									>
										<Edit fontSize="inherit" className={classes.menuItem} />{" "}
										&nbsp; edit
									</MenuItem>
								</Menu>
							</Grid>
						</Grid>
					</MainCard>
					{/* Popup per la modifica */}
					<Dialog
						fullScreen={fullScreen}
						open={openPopup}
						onClose={openPopupHandler}
						aria-labelledby="responsive-dialog-title"
					></Dialog>

					<Dialog
						fullScreen={fullScreen}
						open={openPopupDelete}
						onClose={openPopupDeleteHandler}
						aria-labelledby="responsive-dialog-title"
					>
						<InfoModal
							message="Are you sure?"
							buttonText="Delete"
							closeHandler={openPopupDeleteHandler}
							handler={handlerDelete}
							image={dangerImage}
						/>
					</Dialog>

					<Dialog
						fullScreen={fullScreen}
						open={openPopupDeleted}
						onClose={openPopupDeletedHandler}
						aria-labelledby="responsive-dialog-title"
					>
						<InfoModal
							message="Storage has been deleted"
							buttonText=""
							closeHandler={openPopupDeletedHandler}
							handler={() => {}}
							image={dangerImage}
						/>
					</Dialog>
				</>
			)}
		</>
	);
};

AccountCard.propTypes = {
	isLoading: PropTypes.bool,
};

export default AccountCard;
