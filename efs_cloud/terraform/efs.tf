#sudo mount -t efs file-system-id efs-mount-point/

resource "aws_efs_file_system" "efs" {
  creation_token = "client-efs"
  tags = {
    Name = "MyEfs"
  }
}


resource "aws_efs_mount_target" "mount" {
  count           = length(aws_instance.ec2_instances[*])
  file_system_id  = aws_efs_file_system.efs.id
  subnet_id       = aws_instance.ec2_instances[count.index].subnet_id
  security_groups = [aws_security_group.ec2_security_group.id]
}