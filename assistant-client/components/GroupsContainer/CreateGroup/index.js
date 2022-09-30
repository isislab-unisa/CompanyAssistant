import React, { useEffect, useState } from "react";

import * as Yup from "yup";
import { Formik } from "formik";
import { makeStyles } from "@material-ui/styles";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { create } from "../../../controllers/groupController";
import { getUsers } from "../../../controllers/userController";
import { getTags } from "../../../controllers/tagController";
import dangerImage from "../../../assets/images/danger.png";
import InfoModal from "../../ui-component/infoModal";
import { getRoles } from "../../../controllers/roleController";
import { gridSpacing } from "../../../store/constant";
import MainCard from "../../ui-component/cards/MainCard";
import AnimateButton from "../../ui-component/extended/AnimateButton";

// material-ui
import { useTheme } from "@material-ui/core/styles";
import {
	Grid,
	Divider,
	TextField,
	Typography,
	FormControl,
	OutlinedInput,
	FormHelperText,
	InputLabel,
	Dialog,
	Button,
	Box,
	useMediaQuery,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	loginInput: {
		...theme.typography.customInput,
	},
	formBox: {
		padding: "2em",
	},
	select: {
		marginBottom: "1em",
	},
	divisor: {
		margin: "1em",
	},
	tagTextField: {
		width: "100%",
	},
	submitButton: {
		width: "6em",
		margin: "0 auto",
	},
	submitBox: {
		textAlign: "center",
	},
	card: {
		overflow: "hidden",
		position: "relative",
		maxWidth: "70em",
		margin: "0 auto",
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
	subTitle: {
		textAlign: "center",
		margin: "1em",
		color: theme.palette.grey[700],
	},
	styledToggleButtonGroup: {
		"& .MuiToggleButtonGroup-grouped": {
			margin: theme.spacing(0.5),
			border: 0,
			"&.Mui-disabled": {
				border: 0,
			},
			"&:not(:first-of-type)": {
				borderRadius: theme.shape.borderRadius,
			},
			"&:first-of-type": {
				borderRadius: theme.shape.borderRadius,
			},
		},
		margin: "1em",
		marginLeft: "0",
	},
}));

const CreateGroup = () => {
	const classes = useStyles();

	const [newTags, setNewTags] = React.useState([]);
	const theme = useTheme();

	const [tags, setTags] = React.useState([]);
	const [selectedTags, setSelectedTags] = React.useState([]);
	const [openPopup, setOpenPopup] = useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
	const [isLoadingTags, setIsLoadingTags] = React.useState(false);
	const [roles, setRoles] = React.useState([]);
	const [users, setUsers] = React.useState([]);
	const [selectedUsers, setSelectedUsers] = React.useState([]);
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

	const handleGroupCreated = () => {
		window.location.href = "/groups";
	};

	const openPopupHandler = () => {
		setOpenPopup(!openPopup);
	};

	const handleChangeUsers = (event, users) => {
		setSelectedUsers(users);
	};

	useEffect(() => {
		getRoles((result, error) => {
			if (error != null) {
				alert(error);
			} else {
				setRoles(result);
				setIsLoading(false);
			}
		});

		getUsers((result, error) => {
			if (error != null) {
				alert(error);
			} else {
				setUsers(result);
				setIsLoadingUsers(false);
			}
		});
		getTags((result, error) => {
			if (error != null) {
				alert(error);
			} else {
				setTags(result);
				setIsLoadingTags(false);
			}
		});
	}, []);

	const handleChangeTags = (event, selTags) => {
		setSelectedTags(selTags);
	};

	const handlerInsertTag = () => {
		var tags = newTags;
		var newTag = document.getElementById("formTag").value;
		var found = false;
		tags.map((item, i) => {
			if (item == newTag) {
				found = true;
			}
		});
		if (!found) {
			setNewTags(newTags.concat(newTag));
		}
		document.getElementById("formTag").value = null;
	};

	if (isLoading || isLoadingUsers) return <h1>Loading...</h1>;

	return (
		<>
			<MainCard
				border={true}
				className={classes.card}
				contentClass={classes.content}
			>
				<Typography variant="h2" className={classes.subTitle}>
					User data
				</Typography>
				<Divider className={classes.divisor} />
				<Formik
					initialValues={{
						groupname: "",
						submit: null,
					}}
					validationSchema={Yup.object().shape({
						groupname: Yup.string()
							.max(10)
							.required("groupname is required")
							.matches(
								/^[a-z]{5,10}/,
								"Must be only lowercase and must contain only letters. Min 5 characters. Max 10 characters"
							),
					})}
					onSubmit={async (
						values,
						{ setErrors, setStatus, setSubmitting, resetForm }
					) => {
						try {
							create(
								(_, error) => {
									if (error != null) {
										alert(error);
										console.log(error);
										setErrors(error);
									}
									setSubmitting(false);
									resetForm();
									setOpenPopup(true);
								},
								{
									groupName: values.groupname,
									selectedTags: selectedTags,
									users: selectedUsers,
								}
							);
						} catch (err) {
							console.error(err);
							setErrors(err);
							setSubmitting(false);
						}
					}}
				>
					{({
						errors,
						handleBlur,
						handleChange,
						handleSubmit,
						isSubmitting,
						touched,
						values,
					}) => (
						<form
							noValidate
							onSubmit={handleSubmit}
							className={classes.formBox}
						>
							<FormControl
								fullWidth
								error={Boolean(touched.groupname && errors.groupname)}
								className={classes.loginInput}
							>
								<InputLabel htmlFor="outlined-adornment-email-login">
									groupname
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-groupname-login"
									type="groupname"
									value={values.groupname}
									name="groupname"
									onBlur={handleBlur}
									onChange={handleChange}
									label="groupname"
									inputProps={{
										classes: {
											notchedOutline: classes.notchedOutline,
										},
									}}
								/>
								{touched.groupname && errors.groupname && (
									<FormHelperText
										error
										id="standard-weight-helper-text-email-login"
									>
										{" "}
										{errors.groupname}{" "}
									</FormHelperText>
								)}
							</FormControl>

							<Divider className={classes.divisor} />

							<Typography variant="h3" className={classes.subTitle}>
								Add tags
							</Typography>

							<Grid container spacing={gridSpacing}>
								<Grid item lg={11} sm={11} md={11} xs={11}>
									<TextField
										id="formTag"
										name="newTag"
										label="New Tag"
										className={classes.tagTextField}
									/>
								</Grid>
								<Grid item xs={1}>
									<Button variant="outlined" onClick={handlerInsertTag}>
										Add
									</Button>
								</Grid>
							</Grid>

							<Box>
								<ToggleButtonGroup
									size="small"
									type="checkbox"
									name="tags"
									onChange={handleChangeTags}
									aria-label="tags"
									value={selectedTags}
									defaultValue={selectedTags}
									className={classes.styledToggleButtonGroup}
								>
									{tags.map((element) => (
										<ToggleButton
											aria-label={element.name}
											value={element.name}
										>
											{element.name}
										</ToggleButton>
									))}
									{newTags.map((element) => (
										<ToggleButton aria-label={element} value={element}>
											{element}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							</Box>

							<Divider className={classes.divisor} />

							<Typography variant="h2" className={classes.subTitle}>
								Select users
							</Typography>
							<Box>
								<ToggleButtonGroup
									size="small"
									type="checkbox"
									name="users"
									onChange={handleChangeUsers}
									aria-label="users"
									value={selectedUsers}
									defaultValue={selectedUsers}
									className={classes.styledToggleButtonGroup}
								>
									{users.map((element) => (
										<ToggleButton
											aria-label={element.name}
											value={element.name}
										>
											{element.name}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							</Box>
							<Divider className={classes.divisor} />
							<Box className={classes.submitBox}>
								<AnimateButton>
									<Button
										className={classes.submitButton}
										disableElevation
										disabled={isSubmitting}
										fullWidth
										size="large"
										type="submit"
										variant="contained"
										color="secondary"
									>
										Create
									</Button>
								</AnimateButton>
							</Box>
						</form>
					)}
				</Formik>
			</MainCard>

			<Dialog
				fullScreen={fullScreen}
				open={openPopup}
				onClose={openPopupHandler}
				aria-labelledby="responsive-dialog-title"
			>
				<InfoModal
					message="Group has been created"
					buttonText="Go to groups"
					closeHandler={openPopupHandler}
					handler={handleGroupCreated}
					image={dangerImage}
				/>
			</Dialog>
		</>
	);
};

export default CreateGroup;
