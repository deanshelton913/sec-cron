##########
# LAMBDA #
##########
module "sec" {
  source = "./_modules/lambda"

  prefix = "sec"

  image_uri = "432916826401.dkr.ecr.us-west-2.amazonaws.com/sec-cron:latest"
  image_cmd = "index.main"

  env_vars = {
    APP_ENV = "production"
  }

  iam_permissions = [
    {
      Action = [
        "s3:*"
      ],
      Effect   = "Allow",
      Resource = "*"
    },
    {
      Action = [
        "cloudwatch:PutMetricData",
      ]
      Effect   = "Allow"
      Resource = "*" # TODO: scope to correct resource
    },
    {
      Action = [
        "dynamodb:*",
      ]
      Effect   = "Allow"
      Resource = "*"
    },
  ]
}

############
# TRIGGERS #
############
resource "aws_cloudwatch_event_rule" "sec" {
  name                = "sec-cron"
  description         = "scheduled every 1 min"
  schedule_expression = "rate(1 minute)"
}

resource "aws_cloudwatch_event_target" "sec" {
  arn  = module.sec.lambda_arn
  rule = aws_cloudwatch_event_rule.sec.name
}

resource "aws_lambda_permission" "sec" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.sec.lambda_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.sec.arn
}
