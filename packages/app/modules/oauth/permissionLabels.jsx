import React from 'react';
import Person from '@material-ui/icons/Person';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Group from '@material-ui/icons/Group';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

export default {
  'users:get': {
    label: 'Lire les informations de n\'importe quel utilisateur',
    icon: <Group />,
    // eslint-disable-next-line max-len
    description: 'Permet à l\'application d\'accéder à n\'importe quelle information des utilistaeurs sans restrictions.',
  },
  'users:create': {
    label: 'Création d\'utilisateurs',
    icon: <PersonAdd />,
    // eslint-disable-next-line max-len
    description: 'Permet à l\'aplication d\'ajouter un nouvel utilisateur et lancer les différentes intégrations de service tiers (Github, Trello, Slack).',
  },
  'users:delete': {
    label: 'Suppression d\'utilisateurs',
    icon: <Delete />,
    // eslint-disable-next-line max-len
    description: 'Permet de supprimmer DÉFINITIVEMENT n\'importe quel utilistauer. Cette action est irréversible et ne doit être utilisé que si la date de sortie d\'entreprise ne suffit pas.',
  },
  'users:modify': {
    label: 'Modification d\'utilisateurs',
    icon: <Edit />,
    description: 'Permet la modification de n\'importe quel utilisateur sans restrictions.',
  },
  'profile:get': {
    label: 'Visionner votre profil',
    icon: <Person />,
    description: 'L\'application à accès à vos informations personnelles (email, nom, prénom, etc).',
  },
  'profile:modify': {
    label: 'Modification de votre profil',
    icon: <Edit />,
    description: 'Permet à l\'application d\'éditer les informations profil LVConnect.',
  },
};
