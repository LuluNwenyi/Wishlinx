import Button from "@/src/components/Button";
import Nav from "@/src/components/Nav";

const Index = () => {
  return (
    <>
      <Nav />
      <main>
        <div className="dsb-main-cnt">
          <section>
            <div>
              <h2>Create new list</h2>
              <form className="ls-form">
                <div className="ls-form-input">
                  <input
                    id="title"
                    type="text"
                    placeholder="Title"
                    required
                    className="c-input"
                  />
                  <input
                    id="desc"
                    type="text"
                    placeholder="Description"
                    required
                    className="c-input"
                  />
                  <select
                    name="category"
                    id="Category"
                    placeholder="Category"
                    required
                    className="c-input"
                    defaultValue="Category"
                  >
                    <option disabled value="">
                      Category
                    </option>
                  </select>
                  <input
                    type="date"
                    placeholder="Expiry date"
                    required
                    className="c-input"
                  />
                </div>

                <Button {...{ text: "Create list" }} extraClass="ls-form-btn" />
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Index;
