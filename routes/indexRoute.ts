import { Request, Response } from 'express';
import iconmapper from '../utils/iconmapper';
import { data, timeAgo } from '../server';

export default function indexRoute() {
  return (req: Request, res: Response) => {
    // var response = ``
    // req.account ? response = `You are logged in as ${req.account.name}` : response = `You are not logged in`
    // res.send(response)
    // res.render('mainpage', {
    //   account: req.account,
    //   url: '/',
    //   mi: iconmapper,
    //   subjects: data.subjects,
    //   persons: data.persons,
    //   timeAgo: timeAgo,
    //   selectedSubjectId: null
    // });
    res.redirect('/s/0/');
  };
}
