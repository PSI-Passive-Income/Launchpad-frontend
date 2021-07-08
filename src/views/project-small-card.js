import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Label,Input } from "reactstrap";
import project from '../assets/img/icons/project-default.jpg';
import bannerGreen from "../assets/img/icons/Banner KYC No Green.svg";
import bannerNo from "../assets/img/icons/Banner KYC Yes Green.svg"


const  arry = [{
    status: "inprogress",
    title: "LOL Token",
    
    
  },{
    status: "Coming Soon",
    title: "LOL Soon Token",

    
  },{
    status: "success",
    title: "Success Token",

    
  },{
    status: "failed",
    title: "Failed Token",

    
  },{
    
      }];

function ProjectSmallCard(props) {
  console.log('prp', props.status);


      //  let filter = arry.filter((sta) => sta.status == props.status);
    // console.log('filter', filter);
    return (
      <>

        {
            // arry.map((stat) => {
            //   if (!props.status) return;
            //   console.log('status', stat);
                    <div className="card card-user">
              <div className="card-body"
            >
              {
                (props.status == 'In Progress') &&
              <span className="badge project-status badge-primary">
                <b>{ props.status }</b>
                </span>

              }
              {
                  (props.status == 'Success') &&
              <span className="badge project-status badge-success">
                <b>{ props.status }</b>
            </span>
              }
                {
                  (props.status == 'Failed') &&
              <span className="badge project-status badge-danger ">
                <b>{ props.status }</b>
            </span>
              }
                 {
                  (props.status == 'Coming Soon') &&
              <span className="badge project-status badge-info ">
                <b>{ props.status }</b>
            </span>
              }
            <img src={ bannerGreen } alt="..." className="banner-kyc z-index-999" />
            <img src={ bannerNo } alt="..." className="banner-audit z-index-999" />
            <p className="card-text">
            </p>
            <div className="author project text-white position-relative">
              <div className="block block-one"></div>
              <div className="block block-two"></div>
              <div className="block block-three"></div>
              <div className="block block-four"></div>
              <div>
                <img src={ project } alt="..." className="avatar" />
                    <h3 className="title">{ props.title }</h3>
              </div>
              <a href="https://etherscan.io/token/0xd4cb461eace80708078450e465881599d2235f1a" target="_blank" className="small" >
                0xd4cb461eace80708078450e465881599d2235f1a</a>
              <br />
              <div className="row">
                <div className="col-md-6">Starts: 01 March 2021</div>
                <div className="col-md-6">Ends: 15 March 2021</div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-6">Soft Cap: 10 PSI</div>
                <div className="col-md-6">Hard Cap: 50 PSI</div>
              </div>
              <div>Liquidity Lock: 10 Years</div>
              <br />
              <div className="progress mt-2 fixed-bottom position-absolute" >
                <div role="progressbar" aria-valuemin="0" aria-valuemax="50" aria-valuenow="0" className="progress-bar bg-success width-112" ><span>
                  <strong>59</strong>
                </span></div>
                <div role="progressbar" aria-valuemin="0" aria-valuemax="50" aria-valuenow="0" className="progress-bar bg-warning width-112" ><span><strong>0</strong></span>
                </div>
              </div>
            </div>
                      </div>
                                </div>

          //  })

          }
    {/* console.log('filter', filter); */}
        </>
    )
    
}
export default ProjectSmallCard;