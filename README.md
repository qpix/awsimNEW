# Introduction
The aws-simlet is a tool that enables you to generate a browser-based [aws-shell](https://github.com/awslabs/aws-shell) simulations that you can embed inside an `<iframe>` to web pages and exam software.

You find a demo of aws-simlet here:  LINK

## How it works
The simlets created with aws-simlet is fully HTML- and JavaScript-based and do not require internet connectivity during usage. All commands and command responses are built into the generated simlets.

During the build process, the aws-simlet fetches information from an existing AWS platform that you have pre-populated with resources. You do manually specify what commands the aws-simlet should run to fetch this information inside the `config.sh` file. The commands you specify inside the `config.sh` file will also be available inside the generated simlet. Commands that you do not specify inside the `config.sh` file will automatically return an **AccessDenied** exception if a user tries to run it inside the simlet.

You build the final simlet by executing the `build.sh` file. You find the compiled files inside the build folder, which is ready to be delivered by a standard web server.

# Basic Usage
The aws-simlet requires [npm](https://github.com/npm/cli), [aws-cli](https://github.com/aws/aws-cli) and support for [basic Unix commands](https://en.wikipedia.org/wiki/List_of_Unix_commands) (included in Mac and Linux per default) to build simlets.

You can build simlets using both Mac and Linux. For the sake of simplicity, we recommended that you build simulations inside a virtual machine running Ubuntu. Check out the tutorial on how to do this later in this ReadMe.

## Configuration
The `config.sh` file defines all commands that should be available in the generated simlet and is the only file that the simlet creator will need to modify before generating simlets.

### config.sh
The main configuration file `config.sh` is divided into two sections:
- AWS CONFIGURATION
- AWS COMMANDS

#### AWS CONFIGURATION
The aws-simlet build process needs AWS credential information and knowledge from what region it should fetch information. This section is optional if you have already configured `aws-cli` for the system user that is generating simlets.
```
# AWS CONFIGURATION #
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=eu-west-1
```

#### AWS COMMANDS
The commands specified in this section will we available in the final simlet. You must only use operations that fetch information from AWS here (get-, describe- and list-).

##### Command Format
The commands you specify must follow one of the two command formats defined below. The format you follow depends on the type of command you list.

###### Command Without Required Option
Some AWS commands do not require options to function (e.g. `aws ec2 describe-instances`). These commands must be written without any options like the example shown below:
```
# AWS COMMANDS #
aws ec2 describe-instances
aws dynamodb list-tables
```

###### Command With Required Option
Some AWS commands require a single option to function (e.g. `aws dynamodb describe-table` and `aws iam get-role-policy`). These commands must be written with the required option and valid option value. If there are multiple valid option values, you can run the command multiple times as shown below:
```
aws dynamodb describe-table --table-name CustomerTable
aws dynamodb describe-table --table-name InstanceStateData
```
The aws-simlet does not have support for multiple options or multiple option values.

#### Example
The following is an example `config.sh` configuration:
```
# AWS CONFIGURATION #
AWS_ACCESS_KEY_ID=*omitted*
AWS_SECRET_ACCESS_KEY=*omitted*
AWS_DEFAULT_REGION=eu-west-1

# AWS COMMANDS #
aws ec2 describe-instances
aws dynamodb list-tables
aws iam list-roles
aws iam get-role --role-name AWSServiceRoleForAutoScaling
aws iam get-role --role-name AWSServiceRoleForElasticLoadBalancing
aws iam get-role --role-name AWSServiceRoleForRDS
aws dynamodb describe-table --table-name CustomerTable
aws dynamodb describe-table --table-name InstanceStateData
```

## Building
Once the host system has all the dependencies installed and a valid configuration in place. We should be able to compile simlets.

We start by generating `src/aws.js` which will contain the **infrastructure state** of our simlet. The executable file `build.sh` is responsible for composing the contents of `aws.js`. It does this partly by running the commands specified in `config.sh`.
```
bash build.sh
```
Make note of any error messages that may occur during the execution of `build.sh`. Only proceed when `build.sh` runs without any errors or warnings.

Once we have generated `src/aws.js`, we are ready to compile the project. The project is compiled by running the following commands:
```
npm install && npm run build
```
If executed successfully, `npm run build` will create a folder named `build/` which we then can deploy to a web server for hosting of the simlet.

# Tutorial - Building simlets with Ubuntu 18.04
This section describes how to build simulations using a newly installed Ubuntu 18.04 machine (running on EC2). First, make sure that the virtual machine has at least two gigabytes of RAM memory (this is equivalent of an instance of type t2.small). To build simlets, we must complete the following steps in order:
1. Set up the AWS environment
2. Install the required dependencies
3. Download and unpack the aws-simlet
4. Modify `config.sh`
5. Build the simlet

### 1. Set up the AWS environment
Say that we want users of our simlet to compare the properties of two dynamodb tables:
* CustomersTable
* EmployeesTable

Before building the simlet, we must create the resources in AWS. Let's start by creating the CustomersTable:
```
aws dynamodb create-table --table-name CustomersTable --attribute-definitions AttributeName=ID,AttributeType=N --key-schema AttributeName=ID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```
Now create the EmployeesTable. In order to have the users of our simlet have something to compare, change the provisioned-throughput to something higher:
```
aws dynamodb create-table --table-name EmployeesTable --attribute-definitions AttributeName=ID,AttributeType=N --key-schema AttributeName=ID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=50,WriteCapacityUnits=50
```
We now have some AWS resources for aws-simlet to fetch. We can now proceed by preparing our system to run aws-simlet.

### 2. Install the required dependencies
The next step is to install `awscli` and `npm`. Since we are working on a newly installed Ubuntu machine, we must update package information before installing packages:
```
sudo apt update && sudo apt install -y awscli npm
```
The aws-simlet requires the latest version of `npm` to build simlets. Update `npm` by executing the following command:
```
sudo npm install npm -g
```
### 3. Download and unpack the aws-simlet
Now that we have the required dependencies installed, we can proceed by downloading the aws-simlet from GitHub and unpack it:
```
wget https://github.com/qpix/aws-simlet/archive/master.zip
sudo apt install -y unzip
unzip master.zip
```
The aws-simlet should be unpacked to a folder named `aws-simlet-master`. Enter the directory before proceeding to the next section:
```
cd aws-simlet-master
```
### 4. Modify config.sh
Please refer to the Configuration section for detailed information on how to modify `config.sh`.

Begin by modifying the **AWS COMMANDS** section of the configuration file to list the commands that should be supported by the simlet.
```
# AWS COMMANDS #
aws dynamodb list-tables
aws dynamodb describe-table --table-name CustomersTable
aws dynamodb describe-table --table-name EmployeesTable
```

Next, we must specify AWS credentials in the **AWS CONFIGURATION** section of the configuration file. It is important that we specify a `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` with sufficient permissions to run the commands we specify in the **AWS COMMANDS** section of the configuration file. We can create a temporary user in AWS for this. Make sure that **AWS_DEFAULT_REGION** is the same region we created the dynamodb tables in.
```
# AWS CONFIGURATION #
AWS_ACCESS_KEY_ID=AKIAIZ7ISNCIXGJIZLJQ
AWS_SECRET_ACCESS_KEY=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
AWS_DEFAULT_REGION=eu-west-1
```

The final `config.sh` looks like this:
```
# AWS CONFIGURATION #
AWS_ACCESS_KEY_ID=AKIAIZ7ISNCIXGJIZLJQ
AWS_SECRET_ACCESS_KEY=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
AWS_DEFAULT_REGION=eu-west-1

# AWS COMMANDS #
aws dynamodb list-tables
aws dynamodb describe-table --table-name CustomersTable
aws dynamodb describe-table --table-name EmployeesTable
```
### 5. Build the simlet
We should now be able to compile the simlet:
```
bash build.sh
npm install && npm run build
```
The command `npm run build` have created a `build` folder for us to deploy to a web server.

Check the Building section for a more detailed description of the steps required to build simlets.
