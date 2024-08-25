# Wishlinx

WishLinx is a platform designed to simplify the process of creating and sharing wishlists for special occasions like birthdays, weddings, baby showers, and more. It enables users to curate and share their desired gifts, ensuring a delightful experience for both gift-givers and recipients.

## Prerequisites
- Python 3.x
- Node.js (for Next.js frontend)
- AWS credentials
- MongoDB Atlas or local server

## To run the backend server locally

**Clone the project**

```bash
  git clone https://github.com/LuluNwenyi/Wishlinx.git
```

**Go to the project directory**

```bash
  cd wishlinx
```

**Create virtual environment**

```bash
  # FOR MACOS/LINUX
  python3 -m venv venv

  # FOR WINDOWS
  py -m venv env
```

**Activate virtual environment**

```bash
  # FOR MACOS/LINUX
  source venv/bin/activate

  # FOR WINDOWS
  .\env\Scripts\activate
```

**Install dependencies**

```bash
  pip install -r requirements.txt
```

**Set environment variables**

```bash
  # FOR MACOS/LINUX
    export FLASK_APP=app.py
    export FLASK_ENV=development
    export FLASK_DEBUG=on
    export SECRET_KEY='mysecretkey'
    export SECURITY_PASSWORD_SALT='password-salt'
    export MONGO_URI=mongodb://localhost:27017/[your-database]
    export AWS_ACCESS_KEY_ID=[Your AWS Access Key]
    export AWS_SECRET_ACCESS_KEY=[Your AWS Secret Key]
    export SES_REGION_NAME=us-east-1
    export S3_REGION_NAME=us-east-1
    export S3_BUCKET_NAME=[Your Bucket Name]
    export SES_EMAIL_SOURCE=[Your Email Address]


  # FOR WINDOWS
    set FLASK_APP=app.py
    set FLASK_ENV=development
    set FLASK_DEBUG=on
    set SECRET_KEY='mysecretkey'
    set SECURITY_PASSWORD_SALT='password-salt'
    set MONGO_URI=mongodb://localhost:27017/[your-database]
    set AWS_ACCESS_KEY_ID=[Your AWS Access Key]
    set AWS_SECRET_ACCESS_KEY=[Your AWS Secret Key]
    set SES_REGION_NAME=us-east-1
    set S3_REGION_NAME=us-east-1
    set S3_BUCKET_NAME=[Your Bucket Name]
    set SES_EMAIL_SOURCE=[Your Email Address]
```

**Start the server**

```bash
  flask run
```

## To run the client-side application
> Make sure you have Node.js installed

**Install the project's dependencies**
```bash
npm install
```

**Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Usage
To access the Application:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

You can test the app on [wishlinx.vercel.app](https://wishlinx.vercel.app).

