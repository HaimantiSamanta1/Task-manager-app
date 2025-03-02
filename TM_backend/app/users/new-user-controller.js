const users = require('./user-model');
var validator = require("email-validator");
const userService = require('../services/use-service');
const jwtTokenService = require('../services/jwt-service');
const bcrypt = require('bcrypt');
const refresh = require('../jwt/refresh-model');

//Add New User Account START
exports.userRegistration = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if required fields are provided
        if (!email || !password) {
            return res.status(406).json({ Status: false, message: 'email and password  are required fields!' });
        }

        // Validate email format
        if (validator.validate(email) !== true) {
            return res.status(400).json({ Status: false, message: 'Email is not valid' });
        }

        // Check if the user already exists
        const existingUser = await userService.findAccount(email);
        if (existingUser) {
            return res.status(400).json({ Status: false, message: 'This email already exists' });
        }
        //const userName = await users.findOne({ name: name }).exec();
        //console.log(userName, "email is already")
        // if (userName) {
        //     return res.status(400).json({ Status: false, message: 'This user name already exists' });
        // }

        // // Capitalize the first letter of each word in the name
        // const capitalizeWords = str => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        // const capitalizedName = capitalizeWords(name);


        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Initialize data object
        let data = {};

        // Set data properties based on validation results
        data = {
            email: email,
           // name: capitalizedName,
            password: hashedPassword
        };
      
        // Create the user account
        const response = await userService.createAccount(data);
        // Generate JWT token
        const Authorization = jwtTokenService.generateJwtToken({ user_id: response._id, LoggedIn: true });

        // Store refresh token
        await jwtTokenService.storeRefreshToken(Authorization, response._id);

        // Get the token ID from the created Refresh document
        const findToken = await refresh.findOne({ user_id: response._id }).select('_id');

        // Update the user's tokens field with the token ID
        await users.findByIdAndUpdate(
            response._id,
            { $push: { tokens: findToken._id } },
            { new: true }
        );

        return res.status(200).json({
            Status: true,
            message: 'User registered successfully',
            data:response
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ Status: false, message: 'Internal Server Error' });
    }
};
//Add New User Account END

//login new user details START
exports.loginUser = async (req, res) => {
    try {
        const {email,password} = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Email and password are required.' });
        }

        // Find user by email
        const user = await userService.findAccount(email);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ status: false, message: 'The email/password is invalid.' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ status: false, message: 'The email/password is invalid.' });
        }

        // Generate JWT token
        const newAccessToken = jwtTokenService.generateJwtToken({
            user_id: user._id,
            LoggedIn: true,
        });

        // Store the refresh token
        await jwtTokenService.updateRefreshToken(user._id, newAccessToken);
        // Send the response with the access token
        return res.status(200).json({
            status: true,
            message: 'Login successful!',
            user_id:user._id,
            accessToken: newAccessToken
        });
    } catch (err) {
        console.log('err', err.message);
        return res.status(400).json({ Status: 'Error', message: 'somthing went wrong' })
    }
}
//login new user END


//Delete User Account START
exports.deleteAccount = async (req, res) => {
    try {
        let { token } = req.userData;
        let { account_id } = req.params
        let data = await userService.findAndDeleteUserAccount(account_id)
        if (data) {
            console.log("Delete User Data ", data)
            return res.status(200).json({ Status: true, message: 'Account delete successfully', data })
        } else {
            return res.status(404).send({ Status: false, message: 'Not Found User Account' })
        }
    } catch (err) {
        console.log("Delete account error", err);
        return res.status(400).json({ Status: false, message: 'sorry! somthing went wrong' })
    }
}
//Delete User Account END



//User logout START
exports.logout = async (req, res) => {
    try {
        let { user_id } = req.userData
        let token = jwtTokenService.generateJwtToken({ user_id, LoggedIn: false })
        await jwtTokenService.updateRefreshToken(user_id, token)
        return res.status(200).json({ Status: true, message: 'Logout Successfully' })
    } catch (err) {
        console.log("logout error", err);
        return res.send({ Status: false, message: '!sorry somthing went wrong' })
    }
}
//User logout END