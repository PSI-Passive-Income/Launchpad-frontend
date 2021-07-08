import React from "react";
import classNames from "classnames";

// reactstrap components
import {Card, CardHeader, CardBody, Row, Col, Label, Input, ButtonGroup, Button} from "reactstrap";
import ProjectSmallCard from "./project-small-card";

function ExploreProject() {
    const [grpName, setgrpName] = React.useState("all");
    const setgrpNameData = (name) => {
        setgrpName(name);
        console.log('name', name);

    };

    return (
        <>
            <div className="content">

                <div className="row">
                    <div className="col-sm-12 mb-10">
                        <ButtonGroup
                            className="btn-group-toggle"
                            data-toggle="buttons"
                        >
                            <Button
                                tag="label"
                                className={classNames("btn btn-xs btn-primary btn-simple", {
                                    active: grpName === "all",
                                })}

                                id="0"
                                size="sm"
                                onClick={() => setgrpNameData("all")}
                            >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          All
                        </span>
                                <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02"/>
                        </span>
                            </Button>
                            <Button

                                id="1"
                                size="sm"
                                tag="label"
                                className={classNames("btn btn-xs btn-primary btn-simple", {
                                    active: grpName === "inprogress",
                                })}
                                onClick={() => setgrpNameData("inprogress")}
                            >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          InProgress
                        </span>
                                <span className="d-block d-sm-none">
                          <i className="tim-icons icon-gift-2"/>
                        </span>
                            </Button>
                            <Button

                                id="2"
                                size="sm"
                                tag="label"
                                className={classNames("btn btn-xs btn-primary btn-simple", {
                                    active: grpName === "comingSoon",
                                })}
                                onClick={() => setgrpNameData("comingSoon")}
                            >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Coming Soon
                        </span>
                                <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02"/>
                        </span>
                            </Button>
                            <Button

                                id="2"
                                size="sm"
                                tag="label"
                                className={classNames("btn btn-xs btn-primary btn-simple", {
                                    active: grpName === "success",
                                })}
                                onClick={() => setgrpNameData("success")}
                            >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Success
                        </span>
                                <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02"/>
                        </span>
                            </Button>
                            <Button

                                id="2"
                                size="sm"
                                tag="label"
                                className={classNames("btn btn-xs btn-primary btn-simple", {
                                    active: grpName === "failed",
                                })}
                                onClick={() => setgrpNameData("failed")}
                            >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Failed
                        </span>
                                <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02"/>
                        </span>
                            </Button>
                        </ButtonGroup>
                    </div>

                    {
                        (grpName == "all" || grpName == "failed") &&
                        <div className="col-md-4">
                            <ProjectSmallCard status="Failed" title="LOL - Token"></ProjectSmallCard>
                        </div>

                    }

                    {
                        (grpName == "all" || grpName == "success") &&
                        <div className="col-md-4">
                            <ProjectSmallCard status="Success" title="LOL - Token"></ProjectSmallCard>
                        </div>
                    }

                    {
                        (grpName == "all" || grpName == "comingSoon") &&
                        <div className="col-md-4">
                            <ProjectSmallCard status="Coming Soon" title="LOL - Token"></ProjectSmallCard>
                        </div>
                    }

                    {
                        (grpName == "all" || grpName == "inprogress") &&
                        <div className="col-md-4">
                            <ProjectSmallCard status="In Progress" title="LOL - Token"></ProjectSmallCard>

                        </div>
                    }

                </div>
            </div>

        </>
    )
}

export default ExploreProject;
