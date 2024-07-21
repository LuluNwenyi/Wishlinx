import { FaCopy, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import ClaimIllustrationSvg from "../svgs/ClaimIllustrationSvg";

const ShareModal = ({ link }: { link: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    <div className="clm-mdl">
      <div className="clm-mdl-hdr">
        <p>Please share your link to your friends</p>
      </div>
      <div className="clm-mdl-cnt">
        <ClaimIllustrationSvg />
        <h5 className="clm-mdl-cnt-title">Share this link!</h5>
        <p className="clm-mdl-cnt-desc">{link}</p>
        <div className="clm-mdl-cnt-share">
          <FacebookShareButton url={link}>
            <FaFacebook />
          </FacebookShareButton>
          <TwitterShareButton url={link}>
            <FaTwitter />
          </TwitterShareButton>
          <WhatsappShareButton url={link}>
            <FaWhatsapp />
          </WhatsappShareButton>
          <button onClick={handleCopy}>
            <FaCopy />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
