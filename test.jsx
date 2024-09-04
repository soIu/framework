'use server';

import Test from './App.jsx';

console.log(Test);

export default async function () {
 console.log('hahahoho');
 return <>
   <span>gua dari server</span>
   <Test/>
 </>;
}
