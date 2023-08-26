/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const bcrypt = require("bcryptjs");

exports.seed = async function(knex) {
  await knex('roles').insert([
    {
      role: "teammember"
    },
    {
      role: "manager"
    },
    {
      role: "owner"
    },
  ]);

  await knex('users').insert([
    {
      firstname: "Billy",
      lastname: "Smith",
      role_id: 1,
      hiredate: "2023-07-29"
    },
    {
      firstname: "Erin",
      lastname: "Shuster",
      role_id: 2,
      email: "eshuster@cfa.com",
      password: bcrypt.hashSync("pass", 8),
      hiredate: "2023-07-29"
    },
    {
      firstname: "Bossman",
      lastname: "Wells",
      role_id: 3,
      email: "bmwelly@ohyeah.com",
      password: bcrypt.hashSync("pass", 8),
      hiredate: "2023-07-29"
    }
  ])
};
