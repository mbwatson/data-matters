# Data Matters Website

## Getting Started

With Node 18 installed on your system, clone this repo and install dependencies with `npm i`.

## 🚧 Local development

Start development server with `npm run start`.

### Test Data

There is a script to generate test content data, which will be dumped into the `src/test/content` directory.

To generate new test content, run `npm run generate`.
There are a few arguments that can be passed to control this script's behavior.
Recall that pattern is `npm run [command] [-- <args>]`.
Passing `verbose` will dump the generated content to the console for visual inspection.
To do a content-generation dry-run, pass `pretend`.
For example, `npm run generate -- verbose pretend` will show you lots of generated data, but not write anything to disk.
This command is particularly useful for getting quick feedback while writing new content-generation functionality.

> Note: Test content is not tracked by version control, as the content generator should be sufficient for every developer to generate comparable content that meets the requirements of the UI.

To start development server with test content as data source, run `npm run start!`.
This is the same a the above `run` command, but with a `!` appended.

> Note: The `start`, `test`, and `build` scripts all interface with content and have test-content-focused counterparts,
> which have the same command with an appended `!`. For example, to build a production bundle of the site with real
> content, run `npm run build`; to build the site with _test_ content, run `npm run build!`.

### Prettier

Prettier is installed as a development dependency, and it's configured to run on new commits.
You can expect to see output like the following when new commits are made:

```
$ git commit -m "add feature x"
🔍  Finding changed files since git revision 4a46f9a.
🎯  Found 0 changed files.
✅  Everything is awesome!
```

## Content Management

All content lives in the `src/content` directory in YAML files.
There are three core content types: Instructors, Courses, and Schedules.
See types for these fields below; a "!" indicates a field is required.

- **Courses**

  - `slug`, `String!`, unique
  - `title`, `String`
  - `description`, `String`
  - `prereqs`, `String`

- **Instructor**

  - `slug` `String`, unique
  - `first_name` `String!`
  - `last_name` `String!`
  - `url` `String`
  - `affiliation` `String`
  - `bio` `String`

- **Schedule**
  - `name` `String!`
  - `slug` `String!`, unique
  - `location` `String!`
  - `registration_url` `String`
  - `blocks`
    - `name` `String!`
      `dates` `[DateString (MM/DD/YYYY format)]!`
      `classes` `[Class]`

where `Class` has this structure:

- **Class**

  - `course` `String!` ref course `slug`
  - `instructor` `String!` ref instructor `slug`
  - `location`: `String`
    - `meeting_url`: `String`

It is safe to think of `slug` as the `id` field, but it shoud be noted that Gatsby adds its own UUID field called `id` under the hood.
Using `slug` as the identifier helps developers keep the relationship between the content artifacts and the URL at top of mind.

### Content & the Build Process

All content starts as YAML. As an example, consider the following YAML file that defines a single instructor.

```
# instructor YAML -- pre-build

slug: selena-okon
first_name: Selena
last_name: O'Kon
affiliation: Hartmann, Botsford and Swift
bio: Veritatis error nihil. Deleniti rem culpa commodi rerum dolores tenetur
  tempore. Sit vel ratione labore in minus maxime. Ea eos repellat consequatur
  dolorem. Illum enim laboriosam nisi facere rem itaque est quo quis.
```

```
                 ----------------
                |                |
YAML ""  --->   | gatsby-node.js |  --->  Object {}  --->   UI
                |                |
                 ----------------
```

Data comes out of the build process (as a result of code residing in `gatsby-node.js`) as JavaScript object for consumption by the UI. Some fields are added during this build step.

For example, consider again the above instructor YAML, which comes out with the following structure.

```
# instructor object -- post-build

{
  slug: 'selena-okon',
  path: '/instructors/selena-okon',
  first_name: 'Selena',
  last_name: 'O\'Kon',
  full_name: 'Selena O\'Kon'
  affiliation: 'Hartmann, Botsford and Swift',
  bio: 'Veritatis error nihil. Deleniti rem culpa commodi rerum dolores tenetur tempore. Sit vel ratione labore in minus maxime. Ea eos repellat consequatur dolorem. Illum enim laboriosam nisi facere rem itaque est quo quis.',
}
```

Notice the object has a couple new fields: `full_name` and `path`.
Here is a list of all new fields added at build time for each data type:

- **instructors**
  - new fields: `path`, `full_name`
- **courses**
  - new fields: `path`
- **schdules**
  - new fields: `path`, `start_date`

Additional fields whose values can be derived from the existing content fields should be added at this step. The goal is to reduce/eliminate redundancy, which help keep a clean code base. The benefit extends beyond the developer experience, though. We also want to minimize the effort required from content managers. To this end, most data massaging--especially computationally complex and reused derivations--should be done at this step, during the build, in `gatsby-node.js`, not in the client, with React.

See Gatsby's documentation on [Customizing the GraphQL Schema](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/) for details on how this can be done.

🔨 ## Feature Development

Ensuring the UI stays predictable is key to its sustainability and success. To help increase the probability of producing a stable application, we'll adhere to a test-driven workflow.

### Workflow

The test content generators should be kept up-to-date with the core code base.
In fact, this should be the first part of the code that gets touched when developing a new feature.
This workflow should be followed when developing new features that involve data changes.

1. Define feature and associated data alterations.
2. Write tests (in `src/test/`) that will validate the desired data structure.

- Note: This test will fail (with both real and test content) as the content remains untouched at this point.

3. Add functionality to `src/test/content-generator.js` to create content with the desired structure, _i.e._, when `npm run generate` is executed.
4. Test with newly generated test data (`npm run test!`).
5. Build UI support for restructured test content.
6. Modify real content to desired new structure.
7. Verify / remediate UI.

Adhering to this workflow means any developer can spin up a local instance of the application with realistic test data at any time. This provides a consistent way to test new features against a suite of content that satisfies the requirements of the UI, including edge cases.
The test suite will mature alongside the code base, helping to enforce structure requirements along the way.

## 🎁 Building for Production

Build a production bundle of this application with `npm run build`, which reside in the `public` directory.

Running `npm run serve` will serve the application at http://localhost:9000/.

## 🚀 Deployment

Deployment notes TBD.
