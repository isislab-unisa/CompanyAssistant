import React, { useEffect, useState } from "react";

import * as Yup from "yup";
import { Formik } from "formik";
import { makeStyles } from "@material-ui/styles";
import { getPolicies } from "../../../controllers/policiesController";
import { create } from "../../../controllers/roleController";
import dangerImage from "../../../assets/images/danger.png";
import InfoModal from "../../ui-component/infoModal"; 
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import MainCard from "../../ui-component/cards/MainCard";
import AnimateButton from "../../ui-component/extended/AnimateButton";

// material-ui
import { useTheme } from "@material-ui/core/styles";
import {
	Grid,
	Divider,
	FormControl,
	Dialog,
	OutlinedInput,
	FormHelperText,
	InputLabel,
	Button,
	Box,
	useMediaQuery,
	Typography,
} from "@material-ui/core";

// assets
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
	tagTextField: {
		width: "100%",
	},
	subTitle: {
		textAlign: "center",
		margin: "1em",
		color: theme.palette.grey[700],
	},
}));

//= ==============================|| AUTH3 - REGISTER ||===============================//

const CreateRole = () => {
	const classes = useStyles();
	const theme = useTheme();
	const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
	const [openPopup, setOpenPopup] = useState(false);
	const [policies, setPolicies] = React.useState([]);
	const [selectedPolicies, setselectedPolicies] = React.useState([]);
	const [newPolicies, setNewPolicies] = React.useState([]);
	const [isLoadingPolicies, setIsLoadingPolicies] = React.useState(true);

	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

	const handleChangePolicies = (event, policies) => {
		setselectedPolicies(policies);
	};

	const handleRoleCreated = () => {
		window.location.href = "/roles";
	};

	const openPopupHandler = () => {
		setOpenPopup(!openPopup);
	};

	useEffect(() => {
		getPolicies((result, error) => {
			if (error != null) {
				alert(error);
			} else {
				setPolicies(result);
				setIsLoadingPolicies(false);
			}
		});
	}, []);

	if (isLoadingPolicies) return <h1>Loading...</h1>;

	return (
		<>
			<MainCard
				border={true}
				className={classes.card}
				contentClass={classes.content}
			>
				<Typography variant="h2" className={classes.subTitle}>
					Create role
				</Typography>
				<Divider className={classes.divisor} />
				<Formik
					initialValues={{
						name: "",
						submit: null,
					}}
					validationSchema={Yup.object().shape({
						name: Yup.string()
							.max(10)
							.required("Name is required")
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
									name: values.name,
									selectedPolicies: selectedPolicies,
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
							id="formCreateVm"
							noValidate
							onSubmit={handleSubmit}
							className={classes.formBox}
						>
							<Grid container fullWidth spacing={matchDownSM ? 0 : 2}>
								<Grid item xs={12} sm={6} lg={12}>
									<FormControl
										fullWidth
										error={Boolean(touched.name && errors.name)}
										className={classes.loginInput}
									>
										<InputLabel htmlFor="name">Name</InputLabel>
										<OutlinedInput
											value={values.name}
											name="name"
											onBlur={handleBlur}
											onChange={handleChange}
											label="Name"
											inputProps={{
												classes: {
													notchedOutline: classes.notchedOutline,
												},
											}}
										/>
										{touched.name && errors.name && (
											<FormHelperText
												error
												id="standard-weight-helper-text-email-login"
											>
												{" "}
												{errors.name}{" "}
											</FormHelperText>
										)}
									</FormControl>
								</Grid>
							</Grid>
							<br></br>

							<Divider className={classes.divisor} />

							<Typography variant="h3" className={classes.subTitle}>
								Add policies
							</Typography>

							<Box>
								<ToggleButtonGroup
									size="small"
									type="checkbox"
									name="policies"
									onChange={handleChangePolicies}
									aria-label="policies"
									value={selectedPolicies}
									defaultValue={selectedPolicies}
									className={classes.styledToggleButtonGroup}
								>
									{policies.map((element) => (
										<ToggleButton
											aria-label={element.name}
											value={element.name}
										>
											{element.name}
										</ToggleButton>
									))}
									{newPolicies.map((element) => (
										<ToggleButton aria-label={element} value={element}>
											{element}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							</Box>
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

			{/* Popup per la modifica */}
			<Dialog
				fullScreen={fullScreen}
				open={openPopup}
				onClose={openPopupHandler}
				aria-labelledby="responsive-dialog-title"
			>
				<InfoModal
					message="The role has been created"
					buttonText="Go to roles page"
					closeHandler={openPopupHandler}
					handler={handleRoleCreated}
					image={dangerImage}
				/>
			</Dialog>
		</>
	);
};

export default CreateRole;
