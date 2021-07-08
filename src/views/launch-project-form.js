import React, {useState} from "react";

// reactstrap components
import { Card, CardHeader, CardBody,Form,FormGroup,Control,FormText,Button ,Row, Col,Input,Label, Container } from "reactstrap";

function LaunchProjectForm(props) {
  const [range, setRange] = React.useState(50);

    // const [ value, setValue ] = React.useState(25);

    //  GetRangeVal = (e) => {
    //   setValue(e.target.value)
    //         console.log('value', range);

    // }
  // callme = (value) => {
  //   console.log('value', value);
  // }
    return (
        <>
            <div className="content">


          <Card>
            <Container>
              <CardBody>

<Form>
  <FormGroup controlId="formBasicEmail">


    <h5 slot="header" className="title">Launch Project</h5>

    <div className="row">
      <div className="col-md-5 pr-md-1">
          <Label>Name</Label>
        <Input label="Name"
                  placeholder="Name"
                 >
        </Input>
      </div>
    </div>



    <div className="row">
                        <div className="col-md-12 pr-md-1">
                            <Label>Token Address</Label>
        <Input label="Token Address"

                    placeholder="Enter token address">
        </Input>
      </div>
    </div>

    <div className="row">
                        <div className="col-md-6 pr-md-1">
                            <Label>HardCap</Label>
        <Input label="Hardcap"
                    placeholder="Hardcap">
        </Input>
      </div>
                        <div className="col-md-6 pr-md-1">
                                                        <Label>Softcap</Label>

        <Input label="Softcap"
                    placeholder="Softcap">
        </Input>
      </div>
     <div className="col-md-6 pr-md-1">
            <Label>Min BNB per wallet</Label>

        <Input label="Min BNB per wallet"
                    placeholder="Min BNB per wallet">
        </Input>
      </div>
           <div className="col-md-6 pr-md-1">
                <Label>Max BNB per wallet</Label>

        <Input label="Max BNB per wallet"
                    placeholder="Max BNB per wallet">
        </Input>
      </div>
    </div>

    <div className="row">
       <div className="col-md-8 pr-md-1">
    <Label>Percentage allocated to PancakeSwap</Label>

         <Input label="Percentage allocated to PancakeSwap"
                    type="range"
                          onChange={(e) => { setRange(e.target.value) }}
                    >
        </Input>
      </div>
      <div className="col-md-4 pr-md-1 text-white">
        <span>{range} %</span>
      </div>
                    </div>
                    <br/>

    <div className="row">
                        <div className="col-md-6 pr-md-1">
                <Label>Token per BNB</Label>
        <Input label="Token per BNB"
                    placeholder="Token per ETH">
        </Input>
                        </div>
            <div className="col-md-6 pr-md-1">
                    <Label>Liquidity lock duration (in days)</Label>

        <Input label="Liquidity lock duration (in days)"
                    placeholder="Liquidity lock duration (in days)">
        </Input>
      </div>
                        <div className="col-md-6 pr-md-1">
                                        <Label>Start date</Label>

        <Input label="Start date"
                    placeholder="Start date">
        </Input>
      </div>
                        <div className="col-md-6 pr-md-1">
                                                                    <Label>End date</Label>

        <Input label="End date"
                    placeholder="End date">
        </Input>
      </div>
    </div>

    <div className="row">
      <div className="col-md-8">
          <label>Description</label>
          <textarea rows="4" cols="80"
                    className="form-control"
                    placeholder="Your project description"
                    >
              </textarea>
      </div>
                    </div>
  </FormGroup>
  <Button variant="seconday" type="submit">
            Save
  </Button>
   <Button className="btn-primary" type="submit">
    Launch
  </Button>
</Form>
</CardBody>
   </Container>
  </Card>
    </div>
        </>
            )
    
}
export default LaunchProjectForm;
