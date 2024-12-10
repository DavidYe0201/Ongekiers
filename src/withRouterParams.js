import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const withRouterParams = (Wrapped) => (props) => {
  const params = useParams();
  const navigate = useNavigate();
  return <Wrapped {...props} params={params} navigate={navigate} />;
};

export default withRouterParams;