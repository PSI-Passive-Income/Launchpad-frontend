import React from "react";
import { Card, CardHeader, CardBody, Row, Col,Container } from "reactstrap";

import logo from "../assets/img/icons/anon.svg";

function ProjectCard() {

    return (
        <>
            <div className="content">

                <Card type="user" className="card-user">
                    <CardBody>

                        <p className="card-text"></p>
                        <div className="author">
                            <div className="block block-one"></div>
                            <div className="block block-two"></div>
                            <div className="block block-three"></div>
                            <div className="block block-four"></div>
                            <div>
                                <img
                                    className="avatar"
                                    src={ logo }
          alt="..."
        />
                                <h5 className="title">
                                    
                                    {/* {{ project.tokenName }} - {{ project.tokenSymbol }} */}
                                </h5>
                            </div>
                            <p className="card-description">
                                {/* {{ project.description }} */}
                            </p>
                        </div>
                    </CardBody>

                    </Card>

            </div>
        </>
    )
}

export default ProjectCard;