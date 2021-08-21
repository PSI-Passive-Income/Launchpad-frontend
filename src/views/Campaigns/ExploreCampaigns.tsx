import React, { useState, useMemo } from 'react'
import classNames from 'classnames'
import { ButtonGroup, Button } from 'reactstrap'
import { useLoading } from '@agney/react-loading'
import { isEmpty } from 'lodash'
import { useCampaigns } from 'state/hooks'
import { CampaignStatus } from 'state/types'
import ProjectCardSmall from './CampaignSmallCard'
import emptyBox from '../../assets/img/empty-white-box.png'

enum ContributedFilter {
  All,
  Yes,
  No,
}

const ExploreCampaigns: React.FC = () => {
  const { campaigns, campaignsLoading } = useCampaigns()

  const [filter, setFilter] = useState(CampaignStatus.All)
  const [contributed, setContributed] = useState(ContributedFilter.All)

  const filteredCampaigns = useMemo(
    () =>
      campaigns?.filter(
        (c) =>
          (filter === CampaignStatus.All || c.status === filter) &&
          (contributed === ContributedFilter.All ||
            (contributed === ContributedFilter.Yes && !c.userContributed.isZero()) ||
            c.userContributed.isZero()),
      ),
    [campaigns, filter, contributed],
  )

  const { containerProps, indicatorEl } = useLoading({
    loading: campaignsLoading,
  })

  return (
    <div className="content" {...containerProps}>
      <div className="row">
        {indicatorEl}

        <div className="col-sm-12 mb-10">
          <ButtonGroup className="btn-group-toggle" data-toggle="buttons">
            <Button
              tag="label"
              className={classNames('btn btn-xs btn-primary btn-simple', {
                active: filter === CampaignStatus.All,
              })}
              id="0"
              size="sm"
              onClick={() => setFilter(CampaignStatus.All)}
            >
              <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">All</span>
              <span className="d-block d-sm-none">
                <i className="tim-icons icon-single-02" />
              </span>
            </Button>
            <Button
              id="1"
              size="sm"
              tag="label"
              className={classNames('btn btn-xs btn-primary btn-simple', {
                active: filter === CampaignStatus.Live,
              })}
              onClick={() => setFilter(CampaignStatus.Live)}
            >
              <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">InProgress</span>
              <span className="d-block d-sm-none">
                <i className="tim-icons icon-gift-2" />
              </span>
            </Button>
            <Button
              id="2"
              size="sm"
              tag="label"
              className={classNames('btn btn-xs btn-primary btn-simple', {
                active: filter === CampaignStatus.NotStarted,
              })}
              onClick={() => setFilter(CampaignStatus.NotStarted)}
            >
              <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Coming Soon</span>
              <span className="d-block d-sm-none">
                <i className="tim-icons icon-tap-02" />
              </span>
            </Button>
            <Button
              id="2"
              size="sm"
              tag="label"
              className={classNames('btn btn-xs btn-primary btn-simple', {
                active: filter === CampaignStatus.Ended,
              })}
              onClick={() => setFilter(CampaignStatus.Ended)}
            >
              <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Success</span>
              <span className="d-block d-sm-none">
                <i className="tim-icons icon-tap-02" />
              </span>
            </Button>
            <Button
              id="2"
              size="sm"
              tag="label"
              className={classNames('btn btn-xs btn-primary btn-simple', {
                active: filter === CampaignStatus.Failed,
              })}
              onClick={() => setFilter(CampaignStatus.Failed)}
            >
              <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Failed</span>
              <span className="d-block d-sm-none">
                <i className="tim-icons icon-tap-02" />
              </span>
            </Button>
          </ButtonGroup>
        </div>

        {isEmpty(filteredCampaigns) ? (
          <div className="col-sm-12 col-md-6 offset-md-2 notoken-column">
            <div className="card text-center">
              <div className="notokens-warning">
                <img src={emptyBox} alt="no-images" height="200px" width="200px" />
              </div>
              <h3>Looks like there are no locks here</h3>
            </div>
          </div>
        ) : null}
        
        {!campaignsLoading && filteredCampaigns
          ? filteredCampaigns.map((campaign, ind) => {
              return <ProjectCardSmall key={campaign.tokenAddress} campaign={campaign} />
            })
          : null}
      </div>
    </div>
  )
}

export default ExploreCampaigns