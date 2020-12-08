import React from "react";
import {
  updateContest,
  changeEditContest,
  clearUpdateContestStore,
} from "../../actions/actionCreator";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ContestForm from "../../components/ContestForm/ContestForm";
import styles from "./Brief.module.sass";
import { submit } from "redux-form";
import ContestInfo from "../Contest/ContestInfo/ContestInfo";
import Error from "../Error/Error";

const Brief = (props) => {
  const setNewContestData = (values) => {
    const data = new FormData();
    Object.keys(values).forEach((key) => {
      if (key !== "file" && values[key]) data.append(key, values[key]);
    });
    if (values.file instanceof File) data.append("file", values.file);
    data.append("contestId", props.contestData.id);
    props.update(data);
  };

  const getContestObjInfo = () => {
    const {
      focusOfWork,
      industry,
      nameVenture,
      styleName,
      targetCustomer,
      title,
      brandStyle,
      typeOfName,
      typeOfTagline,
      originalFileName,
      contestType,
    } = props.contestData;
    const data = {
      focusOfWork,
      industry,
      nameVenture,
      styleName,
      targetCustomer,
      title,
      brandStyle,
      typeOfName,
      typeOfTagline,
      originalFileName,
      contestType,
    };
    const defaultData = {};
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        if (key === "originalFileName") {
          defaultData.file = { name: data[key] };
        } else {
          defaultData[key] = data[key];
        }
      }
    });
    return defaultData;
  };

  const {
    isEditContest,
    contestData,
    changeEditContest,
    updateContest,
    role,
    goChat,
    clearUpdateContestStore,
  } = props;
  const { error } = props.updateContestStore;
  const { id } = props.userStore.data;
  if (!isEditContest) {
    return (
      <ContestInfo
        userId={id}
        contestData={contestData}
        changeEditContest={changeEditContest}
        role={role}
        goChat={goChat}
      />
    );
  } else {
    return (
      <div className={styles.contestForm}>
        {error && (
          <Error
            data={error.data}
            status={error.status}
            clearError={clearUpdateContestStore}
          />
        )}
        <ContestForm
          contestType={contestData.contestType}
          defaultData={getContestObjInfo()}
          submitData={setNewContestData}
        />
        {isEditContest ? (
          <div onClick={() => updateContest()} className={styles.changeData}>
            Set Data
          </div>
        ) : null}
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  const { isEditContest } = state.contestByIdStore;
  const { updateContestStore, userStore } = state;
  return { updateContestStore, userStore, isEditContest };
};

const mapDispatchToProps = (dispatch) => {
  return {
    update: (data) => dispatch(updateContest(data)),
    changeEditContest: (data) => dispatch(changeEditContest(data)),
    updateContest: () => dispatch(submit("contestForm")),
    clearUpdateContestStore: () => dispatch(clearUpdateContestStore()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Brief));
