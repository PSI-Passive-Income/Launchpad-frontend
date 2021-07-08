import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import  ProjectCard  from "./project-card.js";
import LaunchProjectForm from "./launch-project-form";

function launchProject() {
    return (
        <>
            <div className="content">

                <div className="row">
                    <div className="col-md-8">
                        <LaunchProjectForm>  </LaunchProjectForm>
                </div>
                <div className="col-md-4">
                    <ProjectCard></ProjectCard>
            </div>
                </div>
                </div>
  </>
  )
}

export default launchProject;
