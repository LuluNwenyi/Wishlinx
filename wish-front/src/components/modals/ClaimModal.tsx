import ClaimIllustrationSvg from "../svgs/ClaimIllustrationSvg";

const ClaimModal = () => {
  return (
    <div className="clm-mdl">
      <div className="clm-mdl-hdr">
        <p>Don’t forget to fulfil your claims :)</p>
      </div>
      <div className="clm-mdl-cnt">
        <ClaimIllustrationSvg />
        <h5 className="clm-mdl-cnt-title">You’re fulfiling wishes!</h5>
        <p className="clm-mdl-cnt-desc">
          Thank you for reserving this item. We’ve notified them of your claim.
        </p>
      </div>
    </div>
  );
};

export default ClaimModal;
