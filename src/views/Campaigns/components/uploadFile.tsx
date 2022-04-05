import React, { useState } from 'react'
import { Button, Collapse } from 'react-bootstrap'
import { Campaign } from 'state/types'
// import { uploadCampaignFile } from 'utils/apiHelper';

interface Props {
  campaign: Campaign
}

const UploadOption: React.FC<Props> = ({ campaign }) => {
  const [selectedFile, setSelectedFile] = useState<any>()
  const [isOpenFile, setIsOpenFile] = useState(false)
  const [isOpenLink, setIsOpenLink] = useState(false)

  const toggleFile = () => {
    setIsOpenFile(!isOpenFile)
  }
  const toggleLink = () => {
    setIsOpenLink(!isOpenLink)
  }

  const handleUpload = (event: any) => {
    event.preventDefault()
    setSelectedFile(event.target.files[0])
  }
  const handleSumit = async () => {
    const formData = new FormData()
    console.log('selectedFile', selectedFile, selectedFile.name)
    formData.append('file', selectedFile, selectedFile.name)
    // const abc = await uploadCampaignFile(campaign.campaignAddress, formData)
  }

  return (
    <div className="card">
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button color="primary" onClick={toggleFile} style={{ marginBottom: '1rem' }}>
            Upload Audit File
          </Button>
          <Button color="primary" onClick={toggleLink} style={{ marginBottom: '1rem' }}>
            Upload Social Media Link
          </Button>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="col-lg-6">
                <Collapse isOpen={isOpenFile}>
                  <input type="file" id="myFile" name="filename" onChange={handleUpload} />
                  <input type="submit" onClick={handleSumit} />
                </Collapse>
              </div>
              <div className="col-lg-6">
                <Collapse isOpen={isOpenLink}>
                  <p>Provide social Media link</p>
                </Collapse>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadOption
