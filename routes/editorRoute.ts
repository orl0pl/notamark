import  iconmapper from "../utils/iconmapper";

const editorRoute = (req, res) => {
    if (req.account?.roles.includes('editor')) {
      res.render('editor.ejs', {
        url: '../../',
        mi: iconmapper,
        error: null,
        account: req.account
      });
  
    }
    else {
      res.send('You cannot edit');
    }
  };

  export default editorRoute;