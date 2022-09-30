import PropTypes from "prop-types";
import { useState } from "react";

import MainCard from "../../ui-component/cards/MainCard";
import SkeletonEarningCard from "../../ui-component/cards/Skeleton/EarningCard";

import { Button, Box, Grid, Menu, MenuItem, Typography } from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import GetAppTwoToneIcon from "@mui/icons-material/GetAppOutlined";
import FileCopyTwoToneIcon from "@mui/icons-material/FileCopyOutlined";
import PictureAsPdfTwoToneIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ArchiveTwoToneIcon from "@mui/icons-material/ArchiveOutlined";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: "16px !important",
  },
  whiteButton: {
    color: "#fff",
    textColor: "#fff",
    cursor: "pointer",
  },
  spacer: {
    marginTop: "4.5em",
    marginBottom: "4.5em",
  },
  card: {
    backgroundColor: theme.palette.secondary.dark,
    color: "#fff",
    overflow: "hidden",
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      width: 210,
      height: 210,
      background: theme.palette.secondary[800],
      borderRadius: "50%",
      top: -85,
      right: -95,
      [theme.breakpoints.down("sm")]: {
        top: -105,
        right: -140,
      },
    },
    "&:before": {
      content: '""',
      position: "absolute",
      width: 210,
      height: 210,
      background: theme.palette.secondary[800],
      borderRadius: "50%",
      top: -125,
      right: -15,
      opacity: 0.5,
      [theme.breakpoints.down("sm")]: {
        top: -155,
        right: -70,
      },
    },
  },
}));

const WelcomeCard = ({ isLoading }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={true}
          className={classes.card}
          contentClass={classes.content}
          content={false}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item></Grid>
                  <Grid item>
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
                      <MenuItem onClick={handleClose}>
                        <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Card
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Copy Data
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Export
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Archive File
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography
                      sx={{
                        fontSize: "1.225rem",
                        fontWeight: 600,
                        mr: 1,
                        mt: 1.75,
                        mb: 0.75,
                      }}
                    >
                      Welcome on CompanyAssistant
                    </Typography>
                  </Grid>
                  <Grid item></Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  <p className={classes.spacer} />
                  <Button
                    className={classes.whiteButton}
                    onClick={() => (window.location.href = "./vms")}
                    size="small"
                    disableElevation
                  >
                    Go to virtual machines
                    <ChevronRightOutlinedIcon />
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
};

WelcomeCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default WelcomeCard;
