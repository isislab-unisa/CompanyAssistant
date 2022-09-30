import PropTypes from "prop-types";
import Image from "next/image";
import azure from "./../../../assets/images/azure.png";
import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import {
	Avatar,
	List,
	ListItem,
	Grid,
	Button,
	ListItemAvatar,
	Typography,
	Menu,
	MenuItem,
	Dialog,
	useMediaQuery,
	Divider,
} from "@material-ui/core";
import MainCard from "../../ui-component/cards/MainCard";
import TotalIncomeCard from "../../ui-component/cards/Skeleton/TotalIncomeCard";
import GetAppTwoToneIcon from "@material-ui/icons/DeleteOutline";
import { StorageOutlined } from "@material-ui/icons";
import dangerImage from "../../../assets/images/danger.png";
import backupImage from "../../../assets/images/backup.png";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import InfoModal from "../../ui-component/infoModal";
import BackupModal from "../../ui-component/BackupModal";
import { remove, use } from "../../../controllers/vmController";
import { useTheme } from "@material-ui/core/styles";

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
		width: "4.5em",
		height: "4.5em",
		marginRight: "0.5em",
	},

	useButton: {
		margin: "0 auto",
		width: "100%",
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
	menuItem: {
		fontSize: "1.2rem",
	},
}));

const VmCard = ({ vm, isLoading, updateHandler }) => {
	const classes = useStyles();
	const theme = useTheme();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [openPopup, setOpenPopup] = React.useState(false);
	const [openPopupDeleted, setOpenPopupDeleted] = React.useState(false);
	const [openPopupBackup, setOpenPopupBackup] = React.useState(false);
	const [deleteButton, setDeleteButton] = React.useState(false);
	const [inUse, setInUse] = React.useState(false);

	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClickStart = (event) => {
		var vmName = event.target.value;
		use((result, error) => {
			if (error != null) {
				alert(error);
			} else {
				updateHandler();
				setInUse(!inUse);
			}
		}, vmName);
	};

	const openPopupHandler = () => {
		handleClose();
		setOpenPopup(!openPopup);
	};

	const openPopupDeletedHandler = () => {
		setOpenPopupDeleted(!openPopupDeleted);
	};

	const openPopupBackupHandler = () => {
		setOpenPopupBackup(!openPopupBackup);
	};

	const handlerDeleteVm = () => {
		setOpenPopup(!openPopup);
		remove((result, error) => {
			if (error != null) alert(error);
			else {
				updateHandler();
				openPopupDeletedHandler();
			}
		}, vm.name);
	};

	const handlerBackupVm = () => {
		setOpenPopupBackup(!openPopupBackup);
		if (deleteButton) openPopupHandler();
	};

	useEffect(() => {
		setInUse(vm.inUse);
	}, []);

	if (isLoading) {
		return <TotalIncomeCard />;
	} else {
		return (
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
											<Image src={azure} width="80%" height="80%" />
										</Avatar>
									</ListItemAvatar>
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
								<MenuItem
									onClick={() => {
										openPopupBackupHandler();
										setDeleteButton(true);
									}}
								>
									delete&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<GetAppTwoToneIcon
										fontSize="inherit"
										className={classes.menuItem}
									/>
								</MenuItem>
								<Divider />
								<MenuItem
									onClick={() => {
										openPopupBackupHandler();
									}}
								>
									backup&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<StorageOutlined
										fontSize="inherit"
										className={classes.menuItem}
									/>
								</MenuItem>
							</Menu>
						</Grid>
					</Grid>
					<Grid container>
						<Typography variant="h3">
						<p />
							<Divider />
							<p />
							{vm.name}
							<p />
							<Typography variant="h6">
								<p />
								{vm.vmType}
								<p />
								{inUse ? vm.ipAddr : ""}
							</Typography>
						</Typography>
					</Grid>
					<Grid container>
						<Button
							variant="contained"
							id={"StartButton" + vm.name}
							value={vm.name}
							onClick={handleClickStart}
							className={classes.useButton}
						>
							{inUse ? "Stop" : "Start"}
						</Button>
					</Grid>
				</MainCard>

				<Dialog
					fullScreen={fullScreen}
					open={openPopupBackup}
					onClose={openPopupBackupHandler}
					aria-labelledby="responsive-dialog-title"
				>
					<BackupModal
						message="Do you want to make a backup?"
						buttonText="Yes"
						closeHandler={openPopupBackupHandler}
						handler={handlerBackupVm}
						image={backupImage}
						vmName={vm.name}
					/>
				</Dialog>
				<Dialog
					fullScreen={fullScreen}
					open={openPopup}
					onClose={openPopupHandler}
					aria-labelledby="responsive-dialog-title"
				>
					<InfoModal
						message="Are you sure?"
						buttonText="Delete"
						closeHandler={openPopupHandler}
						handler={handlerDeleteVm}
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
						message="Virtual machine has been deleted"
						buttonText=""
						closeHandler={openPopupDeletedHandler}
						image={dangerImage}
					/>
				</Dialog>
			</>
		);
	}
};

VmCard.propTypes = {
	isLoading: PropTypes.bool,
};

export default VmCard;
