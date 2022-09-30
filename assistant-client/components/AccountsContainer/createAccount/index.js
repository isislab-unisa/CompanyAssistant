import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { makeStyles } from "@material-ui/styles";
import { getParemeters, create } from "../../../controllers/accountController";
import dangerImage from "../../../assets/images/danger.png";
import InfoModal from "../../ui-component/infoModal";

import {
	Divider,
	FormControl,
	TextField,
	Dialog,
	OutlinedInput,
	FormHelperText,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Box,
	useMediaQuery,
	Typography,
} from "@material-ui/core";

import MainCard from "../../ui-component/cards/MainCard";
import AnimateButton from "../../ui-component/extended/AnimateButton";

import { useTheme } from "@material-ui/core/styles";

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
	subTitle: {
		textAlign: "center",
		margin: "1em",
		color: theme.palette.grey[700],
	},
}));

const CreateAccount = () => {
	const classes = useStyles();
	const theme = useTheme();
	const [openPopup, setOpenPopup] = useState(false);
	const [providers, setProviders] = React.useState([]);
	const [selectedProvider, setSelectedProvider] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(true);

	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

	const handleMachineCreated = () => {
		window.location.href = "/accounts";
	};

	const openPopupHandler = () => {
		setOpenPopup(!openPopup);
	};

	useEffect(() => {
		getParemeters((result, error) => {
			if (error != null) {
				alert(error);
			} else {
				setProviders(result);
				setIsLoading(false);
			}
		});
	}, []);

	let controls = [];

	if (isLoading) return <h1>Loading...</h1>;

	return (
		<>
			<MainCard
				border={true}
				className={classes.card}
				contentClass={classes.content}
			>
				<Typography variant="h2" className={classes.subTitle}>
					Account data
				</Typography>
				<Divider className={classes.divisor} />
				<Formik
					initialValues={{
						name: "",
						provider: "",
					}}
					validationSchema={Yup.object().shape({
						name: Yup.string()
							.max(10)
							.required("Name is required")
							.matches(
								/^[a-z]{5,10}/,
								"Must be only lowercase and must contain only letters. Min 5 characters. Max 10 characters"
							),
						provider: Yup.string().required("Provider is required"),
					})}
					onSubmit={async (
						values,
						{ setErrors, setStatus, setSubmitting, resetForm }
					) => {
						try {
							console.log(values);
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
									values,
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
							<FormControl
								fullWidth
								error={Boolean(touched.provider && errors.provider)}
								className={classes.select}
							>
								<InputLabel id="provider">Provider</InputLabel>
								<Select
									labelId="provider"
									id="provider"
									name="provider"
									value={values.provider}
									onChange={(e) => {
										setSelectedProvider(e.target.value);
										handleChange(e);
									}}
								>
									{providers.map((element) => (
										<MenuItem value={element.name}>{element.name}</MenuItem>
									))}
								</Select>
								<FormHelperText>
									{errors.provider && touched.provider && errors.provider}
								</FormHelperText>
							</FormControl>
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

							<Divider className={classes.divisor} />

							{providers.map((element) => {
								if (selectedProvider == element.name) {
									controls = [];
									element.parameters.map((parameter) => {
										controls.push(
											<TextField
												value={parameter.name}
												fullWidth
												label={parameter}
												margin="normal"
												name={parameter}
												type="text"
												className={classes.loginInput}
											/>
										);
									});
								}
							})}
							{controls.map((element) => element)}
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
					message="The account has been created"
					buttonText="Go to accounts"
					closeHandler={openPopupHandler}
					handler={handleMachineCreated}
					image={dangerImage}
				/>
			</Dialog>
		</>
	);
};

export default CreateAccount;
