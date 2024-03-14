import ClaimSvg from "@/src/components/svgs/ClaimSvg";

const Index = () => {
  return (
    <section aria-labelledby="claims">
      <div>
        <h2 id="claims">Your Claims</h2>

        <div className="clm-grid">
          <div className="clm-ci hide-on-mb">
            <h3 className="clm-ci-title">54</h3>
            <p className="clm-ci-text">claimed items</p>
          </div>

          <div className="clm-grid-right">
            {Array(4)
              .fill(null)
              .map((_, idx) => (
                <div key={idx} className="clm-cd">
                  <div className="clm-cd-hdr">
                    <ClaimSvg />
                    <div className="clm-cd-title">
                      <p className="clm-cd-title--md">Wish #236871</p>
                      <p className="clm-cd-desc">
                        <span> Oluchi - </span>
                        <a
                          href="#"
                          className="c-clm-title--uln clm-cd-title--bld"
                        >
                          oluchinwenyi@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                  <p className="c-clm-time">2h ago</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
