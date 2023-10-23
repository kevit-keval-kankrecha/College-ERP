export default async (req, res, next) => {
  const loginUser = req.loginUser;

  if (!loginUser) {
    res.status(401).send({ success: false, error: { statusCode: 401, message: 'Unauthorized' } });
  }

  //manage access in Department Routes
  if (req.baseUrl === '/department') {
    //only Admin can manage Department model
    if (loginUser.role === 'Admin' && loginUser.role !== 'Faculty' && loginUser.role !== 'Student') {
      next();
    } else {
      res
        .status(403)
        .send({ success: false, error: { statusCode: 403, message: 'You Have Not Permission to access it' } });
    }
  }

  //manage access in User Routes
  else if (req.baseUrl === '/faculty') {
    //Admin can manage all user
    if (loginUser.role === 'Admin') {
      //Faculty Access
      req.accessRoles = ['Faculty'];
      next();
    }

    //faculty can only change their data and view profile for theirself
    else if (loginUser.role === 'Faculty') {
      if (req.params.id === undefined) {
        req.params.id = req.loginUser._id;
      }
      if (
        (req.method === 'PATCH' && req.params.id == req.loginUser._id && req.body.role !== 'Admin') ||
        (req.method === 'GET' && req.path === '/me')
      ) {
        next();
      } else {
        res
          .status(403)
          .send({ success: false, error: { statusCode: 403, message: 'You Have Not Permission to access it' } });
      }
    }
  }

  //manage access for the student Routes
  else if (req.baseUrl === '/student') {
    //Admin and Faculty can manage students
    if (loginUser.role === 'Admin' || loginUser.role === 'Faculty') {
      next();
    }

    //Student can only change their data and view profile for theirself
    else {
      console.log("hi");
      if (req.params.id === undefined) {
        req.params.id = req.loginUser._id;
      }
      if (
        (req.method === 'PATCH' &&
          req.params.id == req.loginUser._id &&
          req.body.role !== 'Admin' &&
          req.body.role !== 'Faculty') ||
        (req.method === 'GET' && req.path === '/me')
      ) {
        next();
      } else {
        res
          .status(403)
          .send({ success: false, error: { statusCode: 403, message: 'You Have Not Permission to access it' } });
      }
    }
  }

  //manage access for attendance
  else if (req.baseUrl === '/attendance') {
    //Admin and Faculty can manage students
    if (req.loginUser.role === 'Admin' || req.loginUser.role === 'Faculty') {
      next();
    } else {
      res
        .status(403)
        .send({ success: false, error: { statusCode: 403, message: 'You Have Not Permission to access it' } });
    }
  }
};
