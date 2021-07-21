/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
Declaring a global .d.ts file for every js import in the project structure in order for Typescript compilation to go smoothly. 
Utilizing this will not affect the compilation/checks for the pure TS components only helps handle JS imports. 
When typescript files are compiled the compiler will look for a .d.ts file for types for the corresponding import/file, since js files don't have
these files it crash and complain that there is no given type any for the specific import/js-file. 
*/
declare module '*';
